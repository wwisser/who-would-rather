package com.wendelin.whowouldrather.utils

import org.apache.commons.lang3.RandomStringUtils

object IdGenerator {
    private const val LENGTH_GAME: Int = 6
    private const val LENGTH_TOKEN: Int = 16

    fun generateGameId(): String {
        return generateId(LENGTH_GAME)
    }

    fun generateToken(): String {
        return generateId(LENGTH_TOKEN)
    }

    private fun generateId(length: Int): String {
        return RandomStringUtils.randomAlphanumeric(length)
    }
}