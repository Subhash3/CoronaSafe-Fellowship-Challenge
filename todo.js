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
    let allTodos, updatedTodos
    try {
        allTodos = fs.readFileSync(pendingTodosFile)
    } catch (readErr) {
        console.log("Error while reading: ", readErr)
        return
    }
    updatedTodos = allTodos + item + '\n'
    // console.log(allTodos)
    // console.log(updatedTodos)
    try {
        fs.writeFileSync(pendingTodosFile, updatedTodos)
    } catch (writeErr) {
        console.log("Error while writing: ", writeErr)
        return
    }

    console.log("Added todo:", item)

    return
}

const showRemainingTodos = () => {
    let allTodos, allTodosArr, noOfTodos, i, allTodosString

    allTodos = fs.readFileSync(pendingTodosFile).toLocaleString()

    if (allTodos == "") {
        console.log("No pending todos")
        return
    }
    // console.log(allTodos)
    allTodosArr = allTodos.split('\n')
    console.log(allTodosArr)
    noOfTodos = allTodosArr.length - 1 // last item is just an empty string

    allTodosString = ""
    for (i = noOfTodos - 1; i >= 0; i--) {
        allTodosString += `[${i + 1}] ${allTodosArr[i]}`
        if (i != 0) {
            allTodosString += '\n'
        }
    }

    console.log(allTodosString)
    return;
}

let [command, info] = parseArgs()

switch (command) {
    case "help": displayHelp()
        break
    case "add": addTodo(info)
        break
    case "ls": showRemainingTodos()
        break
    default: console.log("Not implemented yet!")
}