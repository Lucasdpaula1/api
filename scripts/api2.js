const apiURL = "https://668dcca8bf9912d4c92be825.mockapi.io/gt02/api/users";
const usuariosPorPagina = 9; // Ajustado para 9 usuários por página
let paginaAtual = 1;
let usuarios = [];

// Função para buscar todos os usuários
async function fetchUsuarios() {
    try {
        const response = await axios.get(apiURL);
        usuarios = response.data;
        displayPaginado();
        popularDropdown(usuarios);
        configurarPesquisa(usuarios); // Adiciona o setup do filtro aqui
    } catch (error) {
        Swal.fire("Erro", "Não foi possível buscar os usuários.", "error");
    }
}

// Função para exibir os usuários na tela com paginação
function displayPaginado(page = 1) {
    const inicio = (page - 1) * usuariosPorPagina;
    const fim = page * usuariosPorPagina;
    const usuariosPaginados = usuarios.slice(inicio, fim);
    displayUsuarios(usuariosPaginados);
    configurarPaginacao(usuarios.length, page);
}

// Função para exibir os usuários na tela
function displayUsuarios(usuarios) {
    const userList = document.getElementById("listaDeUsuarios");
    userList.innerHTML = "";
    usuarios.forEach(user => {
        const usuario = document.createElement("div");
        usuario.className = "col-md-4 mb-3";
        usuario.innerHTML = `
            <div class="card h-100">
                <div class="row g-0">
                    <div class="col-md-4 d-flex align-items-center justify-content-center">
                        <img src="${user.avatar}" alt="${user.name}" class="img-fluid rounded-circle" style="max-width: 100px;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${user.name}</h5>
                            <p class="card-text"><strong>E-mail:</strong> ${user.email}</p>
                            <p class="card-text"><strong>Gênero:</strong> ${user.gender}</p>
                            <p class="card-text"><strong>Telefone:</strong> ${user.phone}</p>
                            <div class="d-flex justify-content-end">
                                <button class="btn btn-warning btn-sm me-2" onclick="modalEditar('${user.id}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deletarUsuario('${user.id}')">Excluir</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        userList.appendChild(usuario);
    });
}

// Função para configurar a paginação
function configurarPaginacao(totalUsuarios, paginaAtual) {
    const totalPages = Math.ceil(totalUsuarios / usuariosPorPagina);
    const paginacao = document.getElementById("paginacao");
    paginacao.innerHTML = "";

    for (let page = 1; page <= totalPages; page++) {
        const li = document.createElement("li");
        li.className = `page-item ${page === paginaAtual ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${page}</a>`;
        li.addEventListener("click", (e) => {
            e.preventDefault();
            displayPaginado(page);
        });
        paginacao.appendChild(li);
    }
}

// Função para configurar a pesquisa
function configurarPesquisa(usuarios) {
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("searchForm");

    function filtrarUsuarios() {
        const query = searchInput.value.toLowerCase();
        const filteredUsers = usuarios.filter(user => 
            user.name.toLowerCase().includes(query) || user.id.includes(query)
        );
        usuarios = filteredUsers;
        displayPaginado();
    }   

    searchInput.addEventListener("input", filtrarUsuarios);
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita o comportamento padrão de envio do formulário
        filtrarUsuarios();
    });
}

// Função para popular o dropdown de gênero
function popularDropdown(usuarios) {
    const genderSet = new Set(usuarios.map(user => user.gender));
    const genderDropdown = document.getElementById("genero");
    genderDropdown.innerHTML = '<option value="">Selecione o Gênero</option>';
    genderSet.forEach(gender => {
        const option = document.createElement("option");
        option.value = gender;
        option.textContent = gender;
        genderDropdown.appendChild(option);
    });
}

// Função para mostrar o modal de criação
function modalCriar() {
    resetModal();
    document.getElementById("userModalLabel").innerText = "Adicionar Usuário";
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    userModal.show();
}

// Função para mostrar o modal de edição
async function modalEditar(userId) {
    try {
        const response = await axios.get(`${apiURL}/${userId}`);
        const user = response.data;

        document.getElementById("userId").value = user.id;
        document.getElementById("nome").value = user.name;
        document.getElementById("email").value = user.email;
        document.getElementById("genero").value = user.gender;
        document.getElementById("telefone").value = user.phone;
        document.getElementById("avatar").value = user.avatar;

        document.getElementById("userModalLabel").innerText = "Editar Usuário";
        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();
    } catch (error) {
        Swal.fire("Erro", "Não foi possível buscar o usuário.", "error");
    }
}

// Função para salvar um usuário (criação ou edição)
async function salvarUsuario() {
    const userId = document.getElementById("userId").value;
    const name = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const gender = document.getElementById("genero").value;
    const phone = document.getElementById("telefone").value;
    const avatar = document.getElementById("avatar").value;

    if (!gender) {
        Swal.fire("Erro", "Por favor, selecione um gênero válido.", "error");
        return;
    }

    const usuario = { name, email, gender, phone, avatar };

    try {
        if (userId) {
            await axios.put(`${apiURL}/${userId}`, usuario);
            Swal.fire("Sucesso", "Usuário atualizado com sucesso.", "success");
        } else {
            await axios.post(apiURL, usuario);
            Swal.fire("Sucesso", "Usuário criado com sucesso.", "success");
        }
        fetchUsuarios();
        const userModal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
        userModal.hide();
    } catch (error) {
        Swal.fire("Erro", "Não foi possível salvar o usuário.", "error");
    }
}

// Função para deletar um usuário
async function deletarUsuario(userId) {
    try {
        await axios.delete(`${apiURL}/${userId}`);
        Swal.fire("Sucesso", "Usuário deletado com sucesso.", "success");
        fetchUsuarios();
    } catch (error) {
        Swal.fire("Erro", "Não foi possível deletar o usuário.", "error");
    }
}

// Função para resetar o modal
function resetModal() {
    document.getElementById("userId").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("genero").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("avatar").value = "";
}

// Inicializa a lista de usuários ao carregar a página
document.addEventListener("DOMContentLoaded", fetchUsuarios);

