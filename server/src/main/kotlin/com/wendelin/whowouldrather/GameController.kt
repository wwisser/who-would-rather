package com.wendelin.whowouldrather

import com.wendelin.whowouldrather.IdGenerator.Companion.generateToken
import org.springframework.web.bind.annotation.*
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import kotlin.streams.asSequence

@RestController
class GameController {

    companion object {
        const val MIN_PLAYERS: Int = 2

        val QUESTIONS: List<String> = listOf(
                "sell their car because of its color",
                "fail their driving license test multiple times",
                "live in a zoo",
                "become a president"
        )
        const val MIN_QUESTIONS: Int = 2
    }

    val games: MutableMap<String, Game> = ConcurrentHashMap()

    data class CreateRequest(val playerName: String, val questionAmount: Int)
    data class CreateResponse(val gameId: String, val token: String)

    @PostMapping("/games")
    fun createGame(@RequestBody body: CreateRequest): CreateResponse {
        if (body.questionAmount < GameController.MIN_QUESTIONS || body.questionAmount > GameController.QUESTIONS.size) {
            throw RuntimeException("Invalid question amount")
        }

        var id: String = IdGenerator.generateGameId()

        while (this.games.containsKey(id)) {
            id = IdGenerator.generateGameId()
        }

        val token: String = IdGenerator.generateToken()
        val player = Player(body.playerName, token)
        this.games[id] = Game(
                id,
                mutableListOf(player),
                player,
                State.WAITING,
                GameController.QUESTIONS.shuffled().subList(0, body.questionAmount - 1),
                ConcurrentHashMap(),
                null
        )

        return CreateResponse(id, token)
    }

    data class JoinRequest(val name: String)

    @PutMapping("/games/{gameId}")
    fun joinGame(@PathVariable("gameId") gameId: String, @RequestBody body: JoinRequest): Player {
        val game: Game = this.games[gameId] ?: throw RuntimeException("Game $gameId not found")

        if (game.state != State.WAITING) {
            throw RuntimeException("Game already running")
        }


        val nameTaken: Boolean = game.players.any { it.name == body.name }

        if (nameTaken) {
            throw RuntimeException("Name $body.name already taken")
        }

        val player = Player(body.name, generateToken())
        game.players.add(player)

        return player
    }

    @PutMapping("/games/{gameId}/start")
    fun startGame(@PathVariable("gameId") gameId: String, @RequestHeader("token") token: String) {
        val game: Game = this.games[gameId] ?: throw RuntimeException("Game $gameId not found")
        val player: Player = game.players.find { it.token == token }
                ?: throw RuntimeException("Failed to resolve token")

        if (game.state != State.WAITING) {
            throw RuntimeException("Game already started")
        }

        if (game.owner == player && game.players.size >= MIN_PLAYERS) {
            game.state = State.PLAYING
            game.currentQuestion = game.questions[0]
        }
    }

    @PutMapping("/games/{gameId}/vote")
    fun vote(
            @PathVariable("gameId") gameId: String,
            @RequestHeader("token") token: String,
            @RequestBody target: String
    ) {
        val game: Game = this.games[gameId] ?: throw RuntimeException("Game $gameId not found")
        val player: Player = game.players.find { it.token == token }
                ?: throw RuntimeException("Failed to resolve token")

        if (game.state != State.PLAYING || game.currentQuestion == null) {
            throw RuntimeException("Voting is not active")
        }

        val targetPlayer: Player = game.players.find { it.name == target }
                ?: throw RuntimeException("Failed to resolve target")
        val votes: MutableSet<Vote> = game.votes[game.currentQuestion!!]
                ?: mutableSetOf()

        if (votes.map { vote -> vote.from.token }.any { it == token }) {
            throw RuntimeException("Already voted")
        }

        votes.add(Vote(player, targetPlayer, System.currentTimeMillis()))

        if (votes.size == game.players.size) {
            if (game.votes.size == game.questions.size) {
                game.state = State.ENDING
                return
            }

            game.currentQuestion = game.questions[game.questions.indexOf(game.currentQuestion + 1)]
        }
    }

    @GetMapping("/games/{gameId}")
    fun getGame(@PathVariable("gameId") gameId: String, @RequestHeader("token") token: String): Game {
        val game: Game = this.games[gameId] ?: throw RuntimeException("Game $gameId not found")
        if (game.players.none { gamePlayer -> gamePlayer.token == token }) {
            throw RuntimeException("Failed to resolve token")
        }

        val responseGame: Game = game.copy()
        responseGame.questions = mutableListOf()
        if (game.state != State.ENDING) {
            responseGame.votes = game.votes.entries
                    .filterNot { entry -> entry.key == game.currentQuestion }
                    .associateByTo(mutableMapOf(), { it.key }, { it.value })
        }

        return responseGame
    }


    @GetMapping("/games")
    fun getAllGames(): Collection<Game> {
        return this.games.values
    }

}

data class Player(val name: String, val token: String)

data class Vote(val from: Player, val target: Player, val time: Long)

enum class State {
    WAITING,
    PLAYING,
    ENDING
}

data class Game(
        val id: String,
        val players: MutableList<Player>,
        var owner: Player,
        var state: State,
        var questions: List<String>,
        var votes: Map<String, MutableSet<Vote>>, // questionIdx <-> votes
        var currentQuestion: String?
)
