// import axios from "axios"
// import Swal from "sweetalert2"

// import axios from "axios"
// import Swal from "sweetalert2"

// export const APIUrl = () => {
//   try {let   url =   axios.get('https://668dcca8bf9912d4c92be825.mockapi.io/gt02/api/users').then((data) =>{
//         console.log(data)
//         return data
       
//     })
//    return url }catch(error){
//         Swal.fire('erro, não foi possivel buscar os elementos,error')
//     }
    
// }
// let usuarios = []
// document.addEventListener('DOMContentLoaded',APIUrl)
const apiurl = "https://668dcca8bf9912d4c92be825.mockapi.io/gt02/api/users"
async function fetchusuarios () {
    let usuarios1 = []
    try {
        const resposta = await axios.get(apiurl)
       let  usuarios = resposta.data
        usuarios1.push(usuarios)
        

    }catch(error){
        Swal.fire("error", "não foi possivel buscar os usuários", "error")
    }
    return usuarios1
}
function display(usuarios){
    const userlist = document.getElementById('listadeusuarios')
    userlist.innerHTML = '';
    usuarios.forEach((user) => {
        const usuario = document.createElement('div')
        usuario.className = 'col-md4 md-3'
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
        userlist.appendChild('usuario');
    })
        
    
}
display(fetchusuarios)
