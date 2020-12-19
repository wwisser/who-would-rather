package com.wendelin.whowouldrather

import com.wendelin.whowouldrather.IdGenerator.Companion.generateToken
import org.springframework.web.bind.annotation.*
import java.util.concurrent.ConcurrentHashMap
import kotlin.streams.asSequence

@RestController
class GameController {

    val games: MutableMap<String, Game> = ConcurrentHashMap()

    @PostMapping("/games")
    fun createGame(@RequestBody name: String): String {
        var id: String = IdGenerator.generateGameId()

        while (this.games.containsKey(id)) {
            id = IdGenerator.generateGameId()
        }

        this.games[id] = Game(
                id,
                mutableListOf(Player(name, IdGenerator.generateToken())),
                State.WAITING,
                ConcurrentHashMap(),
                null
        )

        return id
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
    ): Game {
        val game: Game = this.games[gameId] ?: throw RuntimeException("Game $gameId not found")
        val player: Player = game.players.find { gamePlayer -> gamePlayer.token == token }
                ?: throw RuntimeException("Failed to resolve sender")

        if (game.state != State.PLAYING || game.currentQuestionId == null) {
            throw RuntimeException("Voting is not active")
        }

        val targetPlayer: Player = game.players.find { gamePlayer -> gamePlayer.name == target }
                ?: throw RuntimeException("Failed to resolve target")
        val votes: MutableSet<Vote> = game.votes[game.currentQuestionId]
                ?: mutableSetOf()

        if (votes.map { vote -> vote.from.token }.any { votedToken -> votedToken == token }) {
            throw RuntimeException("Already voted")
        }

        votes.add(Vote(player, targetPlayer, game.currentQuestionId, System.currentTimeMillis()))
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

data class Vote(val from: Player, val target: Player, val questionId: String, val time: Long)

enum class State {
    WAITING,
    PLAYING
}

data class Game(
        val id: String,
        val players: MutableList<Player>,
        val state: State,
        val votes: Map<String, MutableSet<Vote>>,
        val currentQuestionId: String?
)
