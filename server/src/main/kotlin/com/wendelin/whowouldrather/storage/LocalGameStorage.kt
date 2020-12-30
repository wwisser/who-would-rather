package com.wendelin.whowouldrather.storage

import com.wendelin.whowouldrather.Game
import org.springframework.stereotype.Component
import java.util.concurrent.ConcurrentHashMap

@Component
class LocalGameStorage : GameStorage {

    private val games: MutableMap<String, Game> = ConcurrentHashMap()

    override fun getGame(gameId: String): Game {
        return this.games[gameId] ?: throw RuntimeException("Game $gameId not found")
    }

    override fun addGame(game: Game) {
        this.games[game.id] = game
    }

    override fun getAll(): Collection<Game> {
        return this.games.values
    }

    override fun existsGame(gameId: String): Boolean {
        return this.games.containsKey(gameId)
    }

    override fun removeGame(game: Game) {
        this.games.remove(game.id)
    }

}