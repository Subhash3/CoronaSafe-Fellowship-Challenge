const path = require('path')
const fs = require('fs')
const { exit } = require('process')

const pendingTodosFile = path.join('./todo.txt')
const completedTodosFile = path.join('./done.txt')
const argv = process.argv
const argc = argv.length

const parseArgs = () => {
    let command, info = null
    if (argc < 2) {
        console.log('Something went wrong!')
        exit(1)
    }
    if (argc > 4) {
        console.log("Program expects atmost 3 arguments!")
        exit(2)
    }

    if (argc >= 3) {
        command = argv[2]
        if (argc == 4) {
            info = argv[3]
        }
    }


    return [command, info]
}

const displayHelp = () => {
    console.log(`Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`)
}

const addTodo = (item) => {
    let data = fs.readFileSync(pendingTodosFile)
    console.log(data)
}

let [command, info] = parseArgs()

switch (command) {
    case "help": displayHelp()
        break
    case "add": addTodo(info)
        break
    default: console.log("Not implemented yet!")
}