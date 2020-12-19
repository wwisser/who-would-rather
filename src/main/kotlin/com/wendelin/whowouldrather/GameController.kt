package com.wendelin.whowouldrather

import com.wendelin.whowouldrather.IdGenerator.Companion.generateToken
import org.springframework.web.bind.annotation.*
import java.util.concurrent.ConcurrentHashMap
import kotlin.streams.asSequence

@RestController
class GameController {

    companion object {
        val QUESTIONS: List<String> = listOf(
                "sell their car because of its color",
                "fail their driving license test multiple times",
                "live in a zoo",
                "become a president"
        )
        const val MIN_QUESTIONS: Int = 2
    }

    val games: MutableMap<String, Game> = ConcurrentHashMap()

    data class CreateGameRequest(val playerName: String, val questionAmount: Int)
    data class CreateGameResponse(val gameId: String, val token: String)

    @PostMapping("/games")
    fun createGame(@RequestBody body: CreateGameRequest): CreateGameResponse {
        if (body.questionAmount < GameController.MIN_QUESTIONS || body.questionAmount > GameController.QUESTIONS.size) {
            throw RuntimeException("Invalid question amount")
        }

        var id: String = IdGenerator.generateGameId()

        while (this.games.containsKey(id)) {
            id = IdGenerator.generateGameId()
        }

        val token: String = IdGenerator.generateToken()
        this.games[id] = Game(
                id,
                mutableListOf(Player(body.playerName, token)),
                State.WAITING,
                GameController.QUESTIONS.shuffled().subList(0, body.questionAmount - 1),
                ConcurrentHashMap(),
                null
        )

        return CreateGameResponse(id, token)
    }

    @PutMapping("/games/{gameId}")
    fun joinGame(@PathVariable("gameId") gameId: String, @RequestBody name: String): Player {
        val game: Game = this.games[gameId] ?: throw RuntimeException("Game $gameId not found")

        if (game.state != State.WAITING) {
            throw RuntimeException("Game already running")
        }


        val nameTaken: Boolean = game.players.map { player -> player.name }.any { newName -> newName == name }

        if (nameTaken) {
            throw RuntimeException("Name $name already taken")
        }

        val player = Player(name, generateToken())
        game.players.add(player)

        return player
    }

    @PutMapping("/games/{gameId}/vote")
    fun vote(
            @PathVariable("gameId") gameId: String,
            @RequestHeader("token") token: String,
            @RequestBody target: String
    ) {
        val game: Game = this.games[gameId] ?: throw RuntimeException("Game $gameId not found")
        val player: Player = game.players.find { gamePlayer -> gamePlayer.token == token }
                ?: throw RuntimeException("Failed to resolve token")

        if (game.state != State.PLAYING || game.currentQuestion == null) {
            throw RuntimeException("Voting is not active")
        }

        val targetPlayer: Player = game.players.find { gamePlayer -> gamePlayer.name == target }
                ?: throw RuntimeException("Failed to resolve target")
        val votes: MutableSet<Vote> = game.votes[game.currentQuestion]
                ?: mutableSetOf()

        if (votes.map { vote -> vote.from.token }.any { votedToken -> votedToken == token }) {
            throw RuntimeException("Already voted")
        }

        votes.add(Vote(player, targetPlayer, game.currentQuestion, System.currentTimeMillis()))
    }

    @GetMapping("/games/{gameId}")
    fun getGame(@PathVariable("gameId") gameId: String, @RequestHeader("token") token: String): Game {
        val game: Game = this.games[gameId] ?: throw RuntimeException("Game $gameId not found")
        if (game.players.any { gamePlayer -> gamePlayer.token == token }) {
            throw RuntimeException("Failed to resolve token")
        }

        return game
    }


    @GetMapping("/games")
    fun getAll(): Collection<Game> {
        return this.games.values
    }

}

class IdGenerator {
    companion object {
        private const val LENGTH_GAME: Long = 10
        private const val LENGTH_TOKEN: Long = 16
        private const val SRC: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

        fun generateGameId(): String {
            return generateId(LENGTH_GAME)
        }

        fun generateToken(): String {
            return generateId(LENGTH_TOKEN)
        }

        private fun generateId(length: Long): String {
            return java.util.Random().ints(length, 0, SRC.length)
                    .asSequence()
                    .map(IdGenerator.SRC::get)
                    .joinToString("")

        }
    }
}

data class Player(val name: String, val token: String)

data class Vote(val from: Player, val target: Player, val question: String, val time: Long)

enum class State {
    WAITING,
    PLAYING
}

data class Game(
        val id: String,
        val players: MutableList<Player>,
        val state: State,
        val questions: List<String>,
        val votes: Map<String, MutableSet<Vote>>, // questionId <-> votes
        val currentQuestion: String?
)
