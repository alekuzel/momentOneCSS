/**Author: Aleksandra Kuzeleva
 * 2023
 */
"use strict";
//link to web service on localhost
//let let url = "http://localhost/moment5_webservice_vt23-alekuzel/courses.php";
//link to web service on public host
let  url = "https://studenter.miun.se/~alku2200/writeable/webbutveckling3/moment5_webservice_vt23-alekuzel/courses.php";
//variables for the form input
const codeInput = document.getElementById("code");
const nameInput = document.getElementById("name");
const pogressionInput = document.getElementById("progression");
const syllabusInput = document.getElementById("syllabus");
const submitInput = document.getElementById("submit");

submitInput.addEventListener("click", addCourse);
  

window.onload = init;
//get all courses whenthe page loads
function init(){
   getCourses();
}

//get courses from the database. proceed if response status is 200 (OK)
function getCourses(){
     fetch(url)
     .then(response=> {
        if(response.status != 200){
            return }
       
        return response.json()
        .then(data=> displayCourses(data))
        .catch(err=> console.log (err))
     })
}

//display courses gotten by the previous function
//courses are saved to the tbody with id courseTable
//links to course plans are created
function displayCourses(courses){
    const ulEl = document.getElementById("courseTable");
    ulEl.innerHTML = "";
    courses.forEach(course => {
        ulEl.innerHTML += `<tr class="table"><td>${course.code}</td> <td>${course.name}</td> <td>${course.progression}</td><td><a class="link"  href="${course.syllabus}" target="_blank">Syllabus</a></td><td><button id="${course.id}" class="delete"> Delete</button></td></tr>`
    });
    let liEl = document.getElementsByClassName("delete");
    //attach event listener to each delete button
    for(let i = 0; i < liEl.length; i++){
        liEl[i].addEventListener("click", deleteCourse);
    }

}

//detele course
function deleteCourse(event){
    let id = event.target.id; 
    //feth url with id of the course which is to be deleted
    fetch(url + "?id=" + id, {
        //call and execute method DELETE in the courses.php
     "method": "DELETE"
    })
    .then(response => response.json())
    //get all the courses again so that the list of the courses on the page would update
    .then(data => getCourses())
    .catch(err => console.log(err))
 }

 //add new course
function addCourse(event){
    //prevent default action (sending form) unless form is filled 
    event.preventDefault();
    //variable for values of the form fields and submit button
    let code = codeInput.value;
    let name = nameInput.value;
    let progression = pogressionInput.value;
    let syllabus = syllabusInput.value;
    
    let jsonStr = JSON.stringify({
        code: code,
        name : name,
        progression : progression,
        syllabus : syllabus
    });
    //add data to database using the POST method
    fetch(url, {
        "method": "POST",
        headers: {
            "content-type": "application/json"
        },
        "body": jsonStr
    })
    .then(response =>response.json())
    //clear form
    .then(data =>  clearForm())
    .catch(err => console.log(err))
}

function clearForm(){
    codeInput.value = "";
    nameInput.value = "";
    pogressionInput.value = "";
    syllabusInput.value = "";
    //get all courses after all the above values are emptied
    getCourses();

}

