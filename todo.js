const path = require('path')
const fs = require('fs')
const { exit } = require('process')

const pendingTodosFile = path.join('todo.txt')
const completedTodosFile = path.join('done.txt')
const argv = process.argv
const argc = argv.length

const preprocess = () => {
    if (!fs.existsSync(pendingTodosFile)) {
        fs.closeSync(fs.openSync(pendingTodosFile, 'w'))
    }
    if (!fs.existsSync(completedTodosFile)) {
        fs.closeSync(fs.openSync(completedTodosFile, 'w'))
    }
    return
}

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

const createFile = (file) => {
    fs.closeSync(fs.openSync(file, 'w'))
}

const addTodo = (item, dontPrintStuff) => {
    if (!item) {
        console.log("Error: Missing todo string. Nothing added!")
        return
    }
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

    if (!dontPrintStuff) {
        console.log(`Added todo: "${item}"`)
    }

    return
}

const todosToArr = (file) => {
    let allTodos, allTodosArr, noOfTodos, i

    allTodos = fs.readFileSync(pendingTodosFile).toLocaleString()

    allTodosArr = allTodos.split('\n')
    noOfTodos = allTodosArr.length - 1 // last item is just an empty string

    return [allTodos, allTodosArr, noOfTodos]
}

const emptyOutAFile = (file) => {
    fs.truncateSync(file, 0)
}

const showRemainingTodos = () => {
    let allTodos, allTodosArr, noOfTodos, i, allTodosString

    [allTodos, allTodosArr, noOfTodos] = todosToArr(pendingTodosFile)
    if (allTodos == "") {
        console.log("There are no pending todos!")
        return
    }

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

const deleteTodo = (number) => {
    if (number != 0 && !number) {
        console.log("Error: Missing NUMBER for deleting todo.")
        return
    }
    let allTodos, allTodosArr, noOfTodos, i

    [allTodos, allTodosArr, noOfTodos] = todosToArr(pendingTodosFile)
    if (allTodos == "") {
        // console.log("There are no pending todos!")
        return
    }

    if (number < 1 || number > noOfTodos) {
        console.log(`Error: todo #${number} does not exist. Nothing deleted.`)
        return
    }

    emptyOutAFile(pendingTodosFile)
    // console.log(allTodosArr)

    for (i = 0; i < noOfTodos; i++) {
        if (number != i + 1) {
            addTodo(allTodosArr[i], true)
        }
    }

    console.log(`Deleted todo #${number}`)
    return;
}

preprocess()

let [command, info] = parseArgs()
switch (command) {
    case undefined:
    case "help": displayHelp()
        break
    case "add": addTodo(info)
        break
    case "ls": showRemainingTodos()
        break
    case "del": deleteTodo(parseInt(info))
        break
    default: console.log("Not implemented yet!")
}