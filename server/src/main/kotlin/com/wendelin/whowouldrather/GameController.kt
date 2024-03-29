package com.wendelin.whowouldrather

import com.wendelin.whowouldrather.storage.GameStorage
import com.wendelin.whowouldrather.utils.IdGenerator
import com.wendelin.whowouldrather.utils.IdGenerator.generateToken
import org.hibernate.validator.constraints.Range
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import java.util.concurrent.ConcurrentHashMap
import javax.validation.Valid
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

@RestController
@CrossOrigin("*")
@Component
class GameController(val storage: GameStorage) {

    companion object {
        const val MIN_PLAYERS: Int = 2
        const val MAX_PLAYERS: Int = 4
        val QUESTIONS: List<String> = listOf(
            "sell their car because of its color",
            "fail their driving license test multiple times",
            "live in a zoo",
            "become a president"
        )
        const val MIN_QUESTIONS: Int = 2
    }

    data class CreateRequest(
        @field:NotNull @field:NotEmpty @field:Size(min = 4, max = 16) val name: String,
        @field:Range(min = 2, max = 4) val questionAmount: Int
    )

    data class CreateResponse(val gameId: String, val token: String)

    @PostMapping("/games")
    fun createGame(@RequestBody @Valid body: CreateRequest): CreateResponse {
        if (body.questionAmount < MIN_QUESTIONS || body.questionAmount > QUESTIONS.size) {
            throw RuntimeException("Invalid question amount")
        }

        var id: String = IdGenerator.generateGameId()

        while (this.storage.existsGame(id)) {
            id = IdGenerator.generateGameId()
        }

        val token: String = generateToken()
        val player = Player(body.name, token)

        val questions = QUESTIONS.shuffled().subList(0, body.questionAmount)
        this.storage.addGame(
            Game(
                id,
                System.currentTimeMillis(),
                System.currentTimeMillis(),
                mutableListOf(player),
                player,
                State.WAITING,
                questions,
                ConcurrentHashMap(),
                null,
                questions.size
            )
        )

        return CreateResponse(id, token)
    }

    data class JoinRequest(@field:NotNull @field:NotEmpty @field:Size(min = 3, max = 64) val name: String)
    data class JoinResponse(val token: String)

    @PutMapping("/games/{gameId}")
    fun joinGame(@PathVariable("gameId") gameId: String, @RequestBody @Valid body: JoinRequest): JoinResponse {
        val game: Game = this.storage.getGame(gameId)

        if (game.state != State.WAITING) {
            throw RuntimeException("Game already running")
        }

        if (game.players.size >= MAX_PLAYERS) {
            throw RuntimeException("Lobby already full")
        }

        val nameTaken: Boolean = game.players.any { it.name == body.name }

        if (nameTaken) {
            throw RuntimeException("Name $body.name already taken")
        }

        val player = Player(body.name, generateToken())
        game.players.add(player)

        game.lastUpdate = System.currentTimeMillis()

        return JoinResponse(player.token)
    }

    @PutMapping("/games/{gameId}/start")
    fun startGame(@PathVariable("gameId") gameId: String, @RequestHeader("token") token: String) {
        val game: Game = this.storage.getGame(gameId)
        val player: Player = game.players.find { it.token == token }
            ?: throw RuntimeException("Failed to resolve token")

        if (game.state != State.WAITING) {
            throw RuntimeException("Game already started")
        }

        if (game.owner == player && game.players.size >= MIN_PLAYERS) {
            game.state = State.PLAYING
            game.currentQuestion = game.questions[0]
        } else {
            throw RuntimeException("Failed to start game")
        }

        game.lastUpdate = System.currentTimeMillis()
    }

    data class VoteRequest(val target: String)

    @PutMapping("/games/{gameId}/votes")
    fun vote(
        @PathVariable("gameId") gameId: String,
        @RequestHeader("Token") token: String,
        @RequestBody request: VoteRequest
    ) {
        val game: Game = this.storage.getGame(gameId)
        val player: Player = game.players.find { it.token == token }
            ?: throw RuntimeException("Failed to resolve token")

        if (game.state != State.PLAYING || game.currentQuestion == null) {
            throw RuntimeException("Voting is not active")
        }

        val targetPlayer: Player = game.players.find { it.name == request.target }
            ?: throw RuntimeException("Failed to resolve target")
        val votes: MutableSet<Vote> = game.votes[game.currentQuestion!!]
            ?: mutableSetOf()

        if (votes.any { it.from.token == token }) {
            throw RuntimeException("Already voted")
        }

        votes.add(Vote(player, targetPlayer, System.currentTimeMillis()))

        if (game.questionsRemaining > 0) {
            game.questionsRemaining -= 1;
        }

        if (game.votes[game.currentQuestion!!] == null) {
            game.votes[game.currentQuestion!!] = votes
        }

        if (votes.size == game.players.size) {
            if (game.votes.size == game.questions.size) {
                game.state = State.ENDING
                game.currentQuestion = null
                return
            }

            game.currentQuestion = game.questions[game.questions.indexOf(game.currentQuestion!!) + 1]
        }

        game.lastUpdate = System.currentTimeMillis()
    }

    @GetMapping("/games/{gameId}")
    fun getGame(@PathVariable("gameId") gameId: String, @RequestHeader("Token") token: String): Game {
        val game: Game = this.storage.getGame(gameId)
        if (game.players.none { it.token == token }) {
            throw RuntimeException("Failed to resolve token")
        }

        return game
    }

    @GetMapping("/games")
    fun getAllGames(): Collection<Game> {
        return this.storage.getAll()
    }

}
