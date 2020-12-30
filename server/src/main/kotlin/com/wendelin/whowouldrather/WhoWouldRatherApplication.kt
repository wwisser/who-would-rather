package com.wendelin.whowouldrather

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class WhoWouldRatherApplication

fun main(args: Array<String>) {
    runApplication<WhoWouldRatherApplication>(*args)
}
