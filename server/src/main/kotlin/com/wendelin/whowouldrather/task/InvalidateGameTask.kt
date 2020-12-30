package com.wendelin.whowouldrather.task

import com.wendelin.whowouldrather.Game
import com.wendelin.whowouldrather.storage.GameStorage
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class InvalidateGameTask : Runnable {

    @Autowired
    private lateinit var gameStorage: GameStorage

    companion object {
        var MAX_IDLE_TIME: Long = TimeUnit.MINUTES.toMillis(1)
    }

    @Scheduled(fixedRate = 5000)
    override fun run() {
        val gamesToRemove: MutableList<Game> = mutableListOf()

        for (game in this.gameStorage.getAll()) {
            if ((System.currentTimeMillis() - game.lastUpdate) > MAX_IDLE_TIME) {
                gamesToRemove.add(game)
            }
        }

        gamesToRemove.forEach { this.gameStorage.removeGame(it) }
    }

}