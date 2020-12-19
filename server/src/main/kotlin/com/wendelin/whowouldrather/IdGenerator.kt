package com.wendelin.whowouldrather

import java.util.*
import kotlin.streams.asSequence

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
            return Random().ints(length, 0, SRC.length)
                    .asSequence()
                    .map(IdGenerator.SRC::get)
                    .joinToString("")

        }
    }
}