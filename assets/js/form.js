function validation() {
  var email = document.getElementById("email").value;
  var emailReg = /^.+@[^\.].*\.[a-z]{2,}$/;
  if (!email.match(emailReg)) {
    return false;
  } else {
    return true;
  }
}

function displayMessage() {
  let emailForm = document.getElementById("emailFormContainer");
  let formMessage = document.getElementById("formMessage");

  emailForm.className += " hidden";
  formMessage.className += "active";
}

var subscriptionForm = document.getElementById("emailForm");

if (subscriptionForm) {
  document.getElementById("emailForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var xhr = new XMLHttpRequest();
    var url = "https://api.hsforms.com/submissions/v3/integration/submit";
    var portalId = "7637559";
    var formId = "c6101fcd-c2e2-43a2-9c00-4b47cece6e10";
    var finalUrl = url + "/" + portalId + "/" + formId;
    let emailValue = document.getElementById("email").value;
    let errorMessage = document.getElementById("errorMessage");

    if (validation()) {
      errorMessage.className = "";

      let data = {
        fields: [
          {
            name: "email",
            value: emailValue,
          },
        ],
        context: {
          pageUri: "www.getistio.io",
          pageName: "GetMesh Homepage"
        },
      };

      fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((_) => {
        displayMessage();
      });
    } else {
      let formInput = document.getElementById("email");
      formInput.className += "error";
      errorMessage.className += "active";
    }
  });
}
