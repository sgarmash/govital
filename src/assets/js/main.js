$(function() {
  const fields = [
    { input: $('#user__name'), message: 'This field is required' },
    { input: $('#user__phone'), message: 'This field is required' },
    { input: $('#user__country'), message: 'This field is required' },
    { input: $('#user__state'), message: 'This field is required' }
  ];

  const fileInput = $('.contact__file-input');
  const filePreview = $('.contact__preview');
  const fileNameSpan = filePreview.find('.contact__preview-name');
  const removeFileBtn = filePreview.find('.contact__preview-remove');

  $('.button__next').on('click', function(){
    
    if (!validateInput()) {
      return;
    }

    let getIdsteps = $('.contact__steps');

    getIdsteps.each(function(){
      if($(this).data().id === 'next') {
        $(this).removeClass('hidden').addClass('active').slideDown(250);
      }
      if ($(this).data().id === 'first') {
        $(this).addClass('hidden').slideUp(250);
      }
    });

  });

  $('.button__back').on('click', function(){
    let getIdsteps = $('.contact__steps');
    getIdsteps.map(function(){
      if($(this).data().id === 'next') {
        $(this).removeClass('active').addClass('hidden').slideUp(250);
      }
      if ($(this).data().id === 'first') {
        $(this).addClass('active').slideDown(250);
      }
    })
  });

  function validateInput() {
    
    let isValid = true;

    
    $('.error').remove();

    fields.forEach(({ input }) => input.removeClass('invalid'));

    fields.forEach(({ input, message }) => {
      if (input.val() === '') {
        input.addClass('invalid').after($('<span>', { text: message, class: 'error' }));
        isValid = false;
      }
    });

    return isValid;
  }


  fields.forEach(({ input }) => {
    input.on('focus', function(){
      $(this).removeClass('invalid');
      $(this).siblings().remove()
    })
  });


  function validatePhoneInputPhone(event) {
    const input = event.target;
    const inputValue = input.value;

    const pattern = /^[0-9+]+$/;

    if (!pattern.test(inputValue)) {
      input.value = inputValue.slice(0, -1);
    }
  }

  $('#user__phone').on('input', function(event){
    validatePhoneInputPhone(event);
  });


  fileInput.on('change', function () {
    const file = fileInput[0].files[0];
  
    if (file) {
      const allowedFormats = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/rtf', 'text/plain'];
      const maxFileSize = 10 * 1024 * 1024; // 10MB
  
      if (allowedFormats.includes(file.type)) {
        if (file.size <= maxFileSize) {
  
          filePreview.show();
  
          const fileLink = $('<a>').attr('href', URL.createObjectURL(file)).text(file.name);
          const fileSize = formatFileSize(file.size);
          const fileLastModifiedDate = formatDate(file.lastModifiedDate);
          const fileInfo = fileSize + ' | ' + fileLastModifiedDate;
  
          fileNameSpan.append(fileLink);
  
          filePreview.find('.contact__file-size').remove();
  
          filePreview.append($('<p>').addClass('contact__file-size').text(fileInfo));
  
          fileInput.parent().hide();
  
        } else {
          alert('File size must be up to 10MB.');
          fileInput.val('');
        }
      } else {
        alert('Invalid file format. Allowed formats: .doc, .docx, .rtf, .txt');
        fileInput.val('');
      }
    } else {
      filePreview.hide();
      fileInput.parent().show();
    }
  });
  
  
  function formatFileSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }
    return size.toFixed(2) + ' ' + units[index];
  }
  
  function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  }
  

  removeFileBtn.on('click', function () {
    fileInput.val(''); 
    filePreview.hide(); 
    fileNameSpan.find('a').remove(); 
    fileInput.parent().show();
  });

  function submitForm(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const contactInfo = {
      phone: formData.get("user__phone"),
      city: formData.get("user__state"),
      country: formData.get("user__country"),
      name: formData.get("user__name"),
    };

    const questions = [];


    $('.field__questions').each(function(){
      questions.push({
        question: $(this).closest('.contact__answer-row').find('.contact__label').text().trim(),
        answer: $(this).val().trim(),
      });
    });

    questions.push({
      question: 'Additional area',
      answer: $('#contact__area').val().trim(),
    })
  
    const fileInput = formData.get("type__file");

    const file = fileInput instanceof File
      ? {
          name: fileInput.name,
          format: fileInput.name.split('.').pop().toUpperCase(),
          size: fileInput.size,
        }
      : null;
  
    const formDataObject = {
      contactInfo,
      questions,
      file,
    };

    $.ajax({
      url: "https://my-json-server.typicode.com/Nezdara/form-fake-server/data",
      method: "POST",
      data: JSON.stringify(formDataObject),
      contentType: "application/json",
      success: function (response) {
        alert(JSON.stringify(response));
      },
      error: function (xhr, status, error) {
        alert("Error sending form data");
      },
    });
    
  }
 
  $('#contact__form').on('submit', submitForm);

  $('.tooltip').tooltip({
    tooltipClass: 'tooltip',
    position: {
      my: "right center", // Change 'center bottom' to 'right center'
      at: "left-10 center",
    },
  });
});