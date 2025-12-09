// Verificar se está na página de dashboard e redirecionar se não estiver logado
if (window.location.pathname.includes("dashboard.html")) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
  if (!currentUser) {
    window.location.href = "index.html"
  } else {
    document.getElementById("userName").textContent = `Olá, ${currentUser.name}`
    initDashboard()
  }
}

// Alternar entre login e registro
const showRegisterBtn = document.getElementById("showRegister")
const showLoginBtn = document.getElementById("showLogin")
const loginSection = document.getElementById("loginSection")
const registerSection = document.getElementById("registerSection")

if (showRegisterBtn) {
  showRegisterBtn.addEventListener("click", () => {
    loginSection.classList.add("hidden")
    registerSection.classList.remove("hidden")
    clearErrors()
  })
}

if (showLoginBtn) {
  showLoginBtn.addEventListener("click", () => {
    registerSection.classList.add("hidden")
    loginSection.classList.remove("hidden")
    clearErrors()
  })
}

// Função para limpar mensagens de erro
function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message")
  errorElements.forEach((el) => (el.textContent = ""))
}

// Validação de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Registro de usuário
const registerForm = document.getElementById("registerForm")
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    clearErrors()

    const name = document.getElementById("registerName").value.trim()
    const email = document.getElementById("registerEmail").value.trim()
    const password = document.getElementById("registerPassword").value
    const confirmPassword = document.getElementById("registerConfirmPassword").value

    let hasError = false

    // Validação do nome
    if (name.length < 3) {
      document.getElementById("registerNameError").textContent = "Nome deve ter pelo menos 3 caracteres"
      hasError = true
    }

    // Validação do email
    if (!isValidEmail(email)) {
      document.getElementById("registerEmailError").textContent = "E-mail inválido"
      hasError = true
    }

    // Validação da senha
    if (password.length < 6) {
      document.getElementById("registerPasswordError").textContent = "Senha deve ter pelo menos 6 caracteres"
      hasError = true
    }

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      document.getElementById("registerConfirmPasswordError").textContent = "As senhas não coincidem"
      hasError = true
    }

    if (hasError) return

    // Verificar se o email já existe
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    if (users.find((u) => u.email === email)) {
      document.getElementById("registerError").textContent = "Este e-mail já está cadastrado"
      return
    }

    // Salvar novo usuário
    users.push({ name, email, password })
    localStorage.setItem("users", JSON.stringify(users))

    alert("Conta criada com sucesso! Faça login para continuar.")
    registerForm.reset()
    showLoginBtn.click()
  })
}

// Login de usuário
const loginForm = document.getElementById("loginForm")
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    clearErrors()

    const email = document.getElementById("loginEmail").value.trim()
    const password = document.getElementById("loginPassword").value

    let hasError = false

    // Validação do email
    if (!isValidEmail(email)) {
      document.getElementById("loginEmailError").textContent = "E-mail inválido"
      hasError = true
    }

    // Validação da senha
    if (password.length < 6) {
      document.getElementById("loginPasswordError").textContent = "Senha deve ter pelo menos 6 caracteres"
      hasError = true
    }

    if (hasError) return

    // Verificar credenciais
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      document.getElementById("loginError").textContent = "E-mail ou senha incorretos"
      return
    }

    // Salvar usuário atual e redirecionar
    localStorage.setItem("currentUser", JSON.stringify(user))
    window.location.href = "dashboard.html"
  })
}

// Logout
const logoutBtn = document.getElementById("logoutBtn")
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser")
    window.location.href = "index.html"
  })
}

// Inicializar dashboard
function initDashboard() {
  const maintenanceForm = document.getElementById("maintenanceForm")
  const filterType = document.getElementById("filterType")

  // Definir data máxima como hoje
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("maintenanceDate").setAttribute("max", today)

  // Cadastrar manutenção
  maintenanceForm.addEventListener("submit", (e) => {
    e.preventDefault()
    clearErrors()

    const address = document.getElementById("propertyAddress").value.trim()
    const type = document.getElementById("maintenanceType").value
    const description = document.getElementById("maintenanceDescription").value.trim()
    const date = document.getElementById("maintenanceDate").value
    const cost = Number.parseFloat(document.getElementById("maintenanceCost").value)
    const frequency = document.getElementById("maintenanceFrequency").value

    let hasError = false

    // Validações
    if (address.length < 5) {
      document.getElementById("propertyAddressError").textContent = "Endereço deve ter pelo menos 5 caracteres"
      hasError = true
    }

    if (!type) {
      document.getElementById("maintenanceTypeError").textContent = "Selecione o tipo de manutenção"
      hasError = true
    }

    if (description.length < 10) {
      document.getElementById("maintenanceDescriptionError").textContent = "Descrição deve ter pelo menos 10 caracteres"
      hasError = true
    }

    if (!date) {
      document.getElementById("maintenanceDateError").textContent = "Selecione a data"
      hasError = true
    }

    if (isNaN(cost) || cost < 0) {
      document.getElementById("maintenanceCostError").textContent = "Valor inválido"
      hasError = true
    }

    if (!frequency) {
      document.getElementById("maintenanceFrequencyError").textContent = "Selecione a frequência"
      hasError = true
    }

    if (hasError) return

    // Salvar manutenção
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const maintenances = JSON.parse(localStorage.getItem("maintenances") || "[]")

    const newMaintenance = {
      id: Date.now(),
      userId: currentUser.email,
      address,
      type,
      description,
      date,
      cost,
      frequency,
      createdAt: new Date().toISOString(),
    }

    maintenances.push(newMaintenance)
    localStorage.setItem("maintenances", JSON.stringify(maintenances))

    alert("Manutenção cadastrada com sucesso!")
    maintenanceForm.reset()
    displayMaintenances()
  })

  // Filtrar por tipo
  filterType.addEventListener("change", displayMaintenances)

  // Exibir manutenções inicialmente
  displayMaintenances()
}

// Exibir manutenções
function displayMaintenances() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const maintenances = JSON.parse(localStorage.getItem("maintenances") || "[]")
  const filterType = document.getElementById("filterType").value
  const maintenanceList = document.getElementById("maintenanceList")

  // Filtrar manutenções do usuário atual
  let userMaintenances = maintenances.filter((m) => m.userId === currentUser.email)

  // Aplicar filtro de tipo
  if (filterType) {
    userMaintenances = userMaintenances.filter((m) => m.type === filterType)
  }

  // Ordenar por data (mais recente primeiro)
  userMaintenances.sort((a, b) => new Date(b.date) - new Date(a.date))

  if (userMaintenances.length === 0) {
    maintenanceList.innerHTML = '<p class="empty-message">Nenhuma manutenção encontrada.</p>'
    return
  }

  maintenanceList.innerHTML = userMaintenances
    .map(
      (m) => `
        <article class="maintenance-card">
            <div class="maintenance-header">
                <div>
                    <span class="maintenance-type">${m.type}</span>
                </div>
                <button 
                    class="maintenance-delete" 
                    onclick="deleteMaintenance(${m.id})"
                    aria-label="Excluir manutenção"
                >
                    Excluir
                </button>
            </div>
            <div class="maintenance-info">
                <p><strong>Endereço:</strong> ${m.address}</p>
                <p><strong>Data:</strong> ${new Date(m.date + "T00:00:00").toLocaleDateString("pt-BR")}</p>
                <p><strong>Custo:</strong> R$ ${m.cost.toFixed(2).replace(".", ",")}</p>
                <p><strong>Frequência:</strong> ${m.frequency}</p>
            </div>
            <div class="maintenance-description">
                <strong>Descrição:</strong><br>
                ${m.description}
            </div>
        </article>
    `,
    )
    .join("")
}

// Excluir manutenção
function deleteMaintenance(id) {
  if (!confirm("Tem certeza que deseja excluir esta manutenção?")) {
    return
  }

  const maintenances = JSON.parse(localStorage.getItem("maintenances") || "[]")
  const updatedMaintenances = maintenances.filter((m) => m.id !== id)
  localStorage.setItem("maintenances", JSON.stringify(updatedMaintenances))

  displayMaintenances()
}
