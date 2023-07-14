function checkPasswordCriteria(password) {
  const regexList = [
    /[a-z]/, // Pelo menos uma letra minúscula
    /[A-Z]/, // Pelo menos uma letra maiúscula
    /[0-9]/, // Pelo menos um número
    /[$@#&/!.,?-]/, // Pelo menos um caractere especial
    /.{8,}/, // Pelo menos 8 caracteres
  ];

  for (const regex of regexList) {
    if (!regex.test(password)) {
      return false;
    }
  }

  return true;
}

function validatePasswordCriteria() {
  const passwordInput = document.getElementById('password');
  const passwordCriteriaItems = document.querySelectorAll('.password-criteria-item');

  passwordInput.addEventListener('keyup', () => {
    const password = passwordInput.value;

    passwordCriteriaItems.forEach((item, index) => {
      const regex = regexList[index];

      if (regex.test(password)) {
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
    });
  });
}

module.exports = { checkPasswordCriteria, validatePasswordCriteria };
