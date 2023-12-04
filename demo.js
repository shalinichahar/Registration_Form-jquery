$(function(e) {
  var existingData = [];
  let row;

  let name;
  let email = $('#email').val();
  let password = $('#password').val();
  let confirmPassword = $('#confirm_password').val();
  let contactNumber = $('#contact_number').val();
  let address = $('#address').val();
  let profession = $("#checkbox").prop("checked");
  let selectedGenderValue = $("input[name='gender']:checked").val();
  let country = $('#country').val();
 
  
  let previousLocalStorageData = (JSON.parse(localStorage.getItem("formDataArray")));
  if(previousLocalStorageData){
      updateTable(previousLocalStorageData);
      pagination(previousLocalStorageData);
  }

  $.validator.addMethod("selectCountry", function(value){
    return value !== "default"; 
  }, "Please select a country.");


  $("#form").submit(function(e){
    e.preventDefault();
  }).validate({  
    rules: {
      name: "required",
      email: {
        required: true,
        
        email: true
      },
      password: {
        required: true,
        minlength: 5
      },
      confirm_password: {
        required: true,
        minlength: 5,
        equalTo: "#password"
      },
      contact_number: {
        required: true,
        minlength:9,
        maxlength:10,
        number: true
      }, 
      address: {
        required: true
      },
      gender: {
        required: true
      },
      country: {
        selectCountry: true
      }
    },
  
    messages: {
      name: "Please enter your name",
      
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 8 characters long"
      },
      confirm_password: {
        required: "Please re-enter password",
        equalTo: "Please enter confirm password same as password."
      },
      email: "Please enter a valid email address",
      contact_number:{
        required: "Please enter phone number",
      },
      address: "Please enter address",
      gender: "Please select gender",
      country: {
        selectCountry: "Please select the country"
      }
    },
    
    errorPlacement: function(error, element) {
      if (element.attr("name") == "gender") {
          error.insertAfter(element.parent().parent()); // Adjust placement as needed
      } else {
          error.insertAfter(element);
      }
    },
    submitHandler: function(form) {
      if(($('#btn').text()) == "Register"){
        console.log("hey")
        submitHandlerLogic();
      }
      else {
        updateEditData(row);
      }     
    }
  }); 

    function submitHandlerLogic(){
      location.reload() 
      name = $('#name').val();
      email = $('#email').val();
      password = $('#password').val();
      contactNumber = $('#contact_number').val();
      address = $('#address').val();
      profession = $("#checkbox").prop("checked");
      selectedGenderValue = $("input[name='gender']:checked").val();
      country = $('#country').val();
      console.log(profession)
      let formData = {
          "name": name,
          "email" : email,
          "password": password,
          "contactNumber": contactNumber,
          "address": address,
          "profession": profession,
          "gender":selectedGenderValue,
          "country":country
      }
      
      existingData = JSON.parse(localStorage.getItem("formDataArray")) || [];
      existingData.push(formData);
      localStorage.setItem("formDataArray", JSON.stringify(existingData));
      updateTable(existingData);
      if( existingData != []){
        pagination(existingData);
      }
      
      formClear();
    }
    
    function updateTable(tableArray) {  
      let table =  document.getElementsByTagName('tbody')[0];
      table.innerHTML = "";

      name = $('#name').val();
      email = $('#email').val();
      password = $('#password').val();
      contactNumber = $('#contact_number').val();
      address = $('#address').val();
      profession = $("#checkbox").prop("checked");
      selectedGenderValue = $("input[name='gender']:checked").val();
      country = $('#country').val();
  
      for( let i=0; i< 5; i++){    
          var r = table.insertRow();

          var cell1 = r.insertCell();
          var cell2 = r.insertCell();
          var cell3 = r.insertCell();
          var cell4 = r.insertCell();
          var cell5 = r.insertCell();
          var cell6 = r.insertCell();
          var cell7 = r.insertCell();
          var cell8 = r.insertCell();
          var cell9 = r.insertCell();
          var cell10 = r.insertCell();

          cell1.innerHTML = tableArray[i] && tableArray[i].name ? tableArray[i].name : '';
          cell2.innerHTML = tableArray[i] && tableArray[i].email ? tableArray[i].email : '';;
          cell3.innerHTML = tableArray[i] && tableArray[i].password? tableArray[i].password: '';
          cell4.innerHTML = tableArray[i] && tableArray[i].contactNumber? tableArray[i].contactNumber: '';
          cell5.innerHTML = tableArray[i] && tableArray[i].address? tableArray[i].address:'';
          cell6.innerHTML = tableArray[i] && tableArray[i].profession?"employed":'umemployed' ;
          cell7.innerHTML = tableArray[i] && tableArray[i].gender?tableArray[i].gender:'';
          cell8.innerHTML = tableArray[i]&& tableArray[i].country? tableArray[i].country: '';
      
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", function() {
          deleteData(i);
        })

        var editButton = document.createElement("button");
        editButton.textContent  = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", function(){         
          $("#btn").text("Update");
          editData(i,tableArray);
        })
        if(cell1.innerHTML==''){
          r.style.display='none'
          cell9.appendChild(deleteButton).style.display='none';
          cell10.appendChild(editButton).style.display='none';
        }
        else{
            cell9.appendChild(deleteButton);
            cell10.appendChild(editButton);
        }
        
      }     
    } 
    

    function pagination(array){
      const next = document.getElementById('next-button');
      const previous = document.getElementById('prev-button');
      const numberOfItems = array.length;
      let numberOfItemPerPage = 5;
      let currentPage = 1 ;
      const numberOfPages = Math.ceil(numberOfItems/numberOfItemPerPage);
      
      for(let j=0; j < numberOfPages; j++){
        const pageNumber = j+1;
        $('#pagination-number').append('<li class="page-item"><a href="#">' + pageNumber + '</a></li> ');      
      }
      
      const pages = document.getElementById('pagination-number').children;
      console.log(pages)
      if(pages){
        pages[0].style.cssText = `
        background-color: green;
      `;
      }
      
      document.getElementById('pagination-number').addEventListener('click', function(e){
        e.preventDefault()
        $('#next-button').prop('disabled', false);
        $('#prev-button').prop('disabled', false);
        let pageNumberClicked = e.target.innerText;
        currentPage = pageNumberClicked;  
        Array.from(pages).forEach((item)=>{
          item.style.backgroundColor = 'unset';
        })
        pages[pageNumberClicked-1].style.cssText = `
          background-color: green;
        `;
        setCurrentPage(array, pageNumberClicked);            
      })
         
      next.addEventListener('click', (e)=>{
        currentPage++;
        if (currentPage === numberOfPages) {
          $('#next-button').prop('disabled', true);
        } else {
          $('#next-button').prop('disabled', false);
        }
       
        Array.from(pages).forEach((item)=>{
          item.style.backgroundColor = 'unset';
        })
        pages[currentPage-1].style.cssText = `
          background-color: green;
        `;
        nextClicked(array, currentPage, numberOfPages);       
      })

      previous.addEventListener('click', (e)=>{
        pages[0].style.cssText = `
            background-color: green;
          `;
        currentPage--;
        if(currentPage === 1) {
          $('#prev-button').prop('disabled', true);
        } else {
          $('#prev-button').prop('disabled', false);
        }
        
          Array.from(pages).forEach((item)=>{
            item.style.backgroundColor = 'unset';
          })
          pages[currentPage-1].style.cssText = `
            background-color: green;
          `;
        previousClicked(array, currentPage);
        
      })
    }
    
    function nextClicked(array, pageNum, numberOfPages){
      const prevRange = (pageNum - 1) * 5;
      const currRange = pageNum * 5; 
      updateTable(array.slice(prevRange, currRange));
      
    }
    function previousClicked(array, pageNum){
      const prevRange = (pageNum - 1) * 5;
      const currRange = pageNum * 5;
      updateTable(array.slice( prevRange, currRange));
    }
    function setCurrentPage(array, pageNumberClicked){
      const prevRange = (pageNumberClicked - 1) * 5;
      const currRange = pageNumberClicked * 5;
      updateTable(array.slice( prevRange, currRange));
    }
    
    function formClear() {
      $("#name").val("");
      $("#email").val("");
      $("#password").val("");
      $("#confirm_password").val("");
      $("#contact_number").val("");
      $("#address").val("");
      $('#checkbox').prop('checked', false);
      $('input[name="gender"]').prop('checked', false);
      $("#country").val("default"); 
    } 
  
    function deleteData(index) { 
      let x = JSON.parse(localStorage.getItem("formDataArray"))
      if(x){
        console.log(x);
        localStorage.clear();
      }
      let deletedData = x.splice(index, 1);
      localStorage.setItem("formDataArray", JSON.stringify(x));
      updateTable(x);
      formClear();
      $('#btn').innerText = "Register";

    }
 
    function editData(index, existingData) {
      let valueAtIndex = existingData[index];
      name = $('#name').val();
      email = $('#email').val();
      password = $('#password').val();
      contactNumber = $('#contact_number').val();
      address = $('#address').val();
      profession = $('#checkbox').val();
      selectedGenderValue = $("input[name='gender']:checked").val();
      $('#checkbox').prop('checked', valueAtIndex.profession);
      $('input[name="gender"][value="' + valueAtIndex.gender + '"]').prop('checked', true);
      country = $('#country').val();

      if(row == null){
        row = index;
      }
      document.getElementById("name").value = valueAtIndex.name;
      document.getElementById("email").value = valueAtIndex.email;
      document.getElementById("password").value = valueAtIndex.password; 
      document.getElementById("contact_number").value = valueAtIndex.contactNumber; 
      document.getElementById("address").value = valueAtIndex.address; 
      document.getElementById("checkbox").checked = valueAtIndex.profession; 
      document.getElementsByName('input[name="gender"]').checked = valueAtIndex.gender; 
      document.getElementById("country").value = valueAtIndex.country;  
    }

    function updateEditData(row){ 
      let updatedData = JSON.parse(localStorage.getItem("formDataArray"))

       let updateName = ($('#name').val()); 
       let updateEmail = ($('#email').val());
       let updatePass = ($('#password').val());
       let updatenNumber = ($('#contact_number').val());
       let updateAddress = ($('#address').val());
       let updateCheckbox = ($('#checkbox').val());
       let updateGender = ($("input[name='gender']:checked").val());

       let updateCountry = ($('#country').val()); 

       valueAtIndex = updatedData[row]; 
       valueAtIndex.name = updateName;   
       valueAtIndex.email = updateEmail;
       valueAtIndex.password = updatePass;
       valueAtIndex.contactNumber = updatenNumber;
       valueAtIndex.address = updateAddress;
       valueAtIndex.profession = updateCheckbox;
       valueAtIndex.gender = updateGender;
       valueAtIndex.country = updateCountry;

       localStorage.setItem("formDataArray", JSON.stringify(updatedData));  //djfdd
       updateTable(updatedData);   
       $("#btn").text("Register");
      //  formClear();
    }   
});