
function vaciarInputs() {
    const formulario = document.getElementById('agency-form');
    console.log(formulario);
    
    if(formulario) {
        const inputs = document.querySelectorAll('#agency-form' + ' input, textarea, select');
        inputs.forEach(input => {
            input.value = '';
        })
    }
}

function vaciarResultados() {
    const results = document.getElementById('car-list');
    results.innerHTML = '';
}

function soloLectura() {
    const formulario = document.getElementById('agency-form');
    console.log(formulario);
    
    if(formulario) {
        const inputs = document.querySelectorAll('#agency-form' + ' input, textarea, select');
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
        })
    }
}

function botonModificar() {
        const formulario = document.getElementById('agency-form');
                
        if(formulario) {
            const inputs = document.querySelectorAll('#agency-form' + ' input, textarea, select');

            inputs.forEach(input => {
                input.removeAttribute('readonly')
            });
        }
}

function botonAgregar() {
    vaciarInputs();
    botonModificar();
    vaciarResultados();
}

/********************************************************** */

document.getElementById('search').addEventListener('input', () => {
    const searchTerm = document.getElementById('search').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-autos?Marca=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('car-list');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item._id + ", Marca: " + item.Marca + ", Modelo: " + item.Modelo + ", Año: " + item.Año + ", Precio: " + item.Precio + ", Disponibilidad: " + item.Disponibilidad];
                li.dataset.id = item._id;
                li.addEventListener('click', () => {
                    soloLectura();
                    selectResult(item._id);
                });
                botonModificar()
                searchResults.appendChild(li);
            });
        });
});


function selectResult(_id) {
    fetch(`http://localhost:3000/api/completar-auto/${_id}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos del auto recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('car-id').value = data._id;
            document.getElementById('car-brand').value = data.Marca;
            document.getElementById('car-model').value = data.Modelo;
            document.getElementById('car-year').value = data.Año;
            document.getElementById('car-price').value = data.Precio;
            document.getElementById('car-disp').value = data.Disponibilidad;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}
/*************************** INSERCION **********************************/
async function guardarDatos() {
    
    // Obtener los valores de los campos del formulario
    const id_auto = document.getElementById('car-id').value;
    const marca = document.getElementById('car-brand').value;
    const modelo = document.getElementById('car-model').value;
    const año = document.getElementById('car-year').value;
    const precio = document.getElementById('car-price').value;
    const disponibilidad = document.getElementById('car-disp').value;
    

    // Crear un objeto con los datos
    const auto = {
      ID_Auto: id_auto,
      Marca: marca,
      Modelo: modelo,
      Año: año,
      Precio: precio,
      Disponibilidad: disponibilidad
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auto),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs();
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }


  }  

/*********************** BORRADO *****************************************/
async function borrarDatos(_id) {
    console.log('ID del producto a eliminar:', _id);
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-auto/${_id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Producto eliminado:', data);
                alert('Producto eliminado correctamente');
                vaciarInputs();
                vaciarResultados();
                botonModificar();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Hubo un error al eliminar el producto');
        }
    }
}
