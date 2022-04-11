const color_PartialComplete = "#E9F3FF"
const color_Complete = "#DFF1F0"
const color_Incomplete = "#F0F0F0"
const color_Abnormal = "#F5E8E5"
const color_AbnormalBorder = "#FF977E"

// Create element
var comment = document.createElement("a")
comment.href = "../clinician-comment.html"
comment.innerText = '“I tested my blood pressure.”'

// Append the element
var newComments = document.getElementsByClassName("New-comments").item(0)
newComments.append(comment)

main = document.getElementsByTagName("main").item(0)
comment = document.createElement("a")
comment.href = "../clinician-comment.html"
comment.innerText = '“I tested my blood pressure.”'
main.append(comment)



var main
var patient

var avatar
var avatar_img

var data_block
var data

var para

var patient_num = 2
var data_num = 1
var comment_num = 1
for (var i=1; i<patient_num; i++) {
  main = document.getElementsByTagName("main").item(0)
  
  // Create a Patient element
  patient = document.createElement("div")
  patient.classList.add("Patient")


  // Create the avatar of the patient
  avatar = document.createElement("div")
  avatar.classList.add("Avatar")
  
  avatar_img = document.createElement("img")
  avatar_img.classList.add("Avatar_img")
  avatar_img.src = "../avatar/images.jpg"
  avatar_img.alt = "user avatar"

  patient.append(avatar)
  main.append(patient)
  // Add data blocks
  data_block = document.createElement("Data-block")
  patient
  for(var j=0; j<data_num; j++) {
    document.getElementsByClassName('Patient').item(i).append()
  }
}
