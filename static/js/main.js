// console.log('hi');
d3.json("/tasks").then((tasks) => {
    // console.log(tasks);
    var list = d3.select("#tasks");
    list.html("");

    tasks.forEach((task) => {
        var item = list.append("li");
        // console.log(task.description);
        item.text(task.description);
    });
});