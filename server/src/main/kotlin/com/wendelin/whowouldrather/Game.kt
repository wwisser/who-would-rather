package com.wendelin.whowouldrather

import com.fasterxml.jackson.annotation.JsonIgnore

data class Player(val name: String, @JsonIgnore var token: String)

data class Vote(val from: Player, val target: Player, val time: Long)

enum class State {
    WAITING,
    PLAYING,
    ENDING
}

data class Game(
    val id: String,
    val created: Long,
    var lastUpdate: Long = System.currentTimeMillis(),
    var players: MutableList<Player>,
    var owner: Player,
    var state: State,
    @JsonIgnore var questions: List<String>,
    var votes: MutableMap<String, MutableSet<Vote>>, // question <-> votes
    var currentQuestion: String?
)
