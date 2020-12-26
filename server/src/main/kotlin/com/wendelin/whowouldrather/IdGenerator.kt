package com.wendelin.whowouldrather

import org.apache.commons.lang3.RandomStringUtils

class IdGenerator {
    companion object {
        private const val LENGTH_GAME: Int = 10
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
}