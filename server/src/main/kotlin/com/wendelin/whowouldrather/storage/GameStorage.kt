package com.wendelin.whowouldrather.storage

import com.wendelin.whowouldrather.Game

interface GameStorage {

    fun existsGame(gameId: String): Boolean

    fun getGame(gameId: String): Game

    fun removeGame(game: Game)

    fun addGame(game: Game)

    fun getAll(): Collection<Game>

}