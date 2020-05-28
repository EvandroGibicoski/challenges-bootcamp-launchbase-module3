const fs = require('fs');
const data = require('../data.json')
const { age, date, graduation } = require('../utils')


exports.create = function(req, res) {
    return res.render("students/create")
}
exports.show = function(req, res) {
    const { id } = req.params;

    const foundStudent = data.students.find(function(student) {
            return student.id == id;
    })
        if(!foundStudent) 
            return res.send("student not found");

        const student = {
            ...foundStudent,
            age: age(foundStudent.birth),
            degree: graduation(foundStudent.degree),
            classes: foundStudent.classes,
            services: foundStudent.services.split(","),
            created_at: new Intl.DateTimeFormat("pt-br").format(foundStudent.created_at),
        }

            return res.render("students/show", { student });
};

exports.post = function(req, res) {
    const keys = Object.keys(req.body);

    for(key of keys) {
        if(req.body[key] == "") {
            return res.send("Please, fill all fields!");
        }
    }

        let { avatar_url, name, birth, degree, classes, services } = req.body;

    birth = Date.parse(req.body.birth)
    const id = Number(data.students.length + 1)
    const created_at = Date.now()

    
    data.students.push({
        id, 
        avatar_url,
        name, 
        birth, 
        degree, 
        classes,
        services,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write file error");
        return res.redirect("/students");
    })
};

exports.edit = function(req, res) {
    const { id } = req.params;
   
    const foundStudent = data.students.find(function(student) {
            return student.id == id;
    })
        if(!foundStudent) 
            return res.send("student not found");

        const student = {
            ...foundStudent,
            birth: date(foundStudent.birth),
            degree: graduation(foundStudent.degree),
            classes: foundStudent.classes,

        }
            return res.render("students/edit", { student })
}

exports.put = function(req, res) {
    const { id } = req.body;
    let index = 0;

    const foundStudent = data.students.find(function(student, foundIndex) {
        if(id == student.id) {
            index = foundIndex;
            return true
        }

    })

    if(!foundStudent)
        return res.send("student not found!")

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
    }

     data.students[index] = student;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write file error!");

            return res.redirect(`/students/${id}`);
    })
           
}

exports.delete = function(req, res) {
    const { id } = req.body;

    const filteredStudents = data.students.filter(function(student) {
        return student.id != id
    })
    
    data.students = filteredStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write file error!");
            return res.redirect("/students");
    })
}