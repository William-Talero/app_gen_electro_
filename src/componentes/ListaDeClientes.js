import React, { useState } from 'react';
import useObtenerClientes from '../hooks/useObtenerClientes';
import {Lista, ElementoLista, Categoria, Descripcion,  Valor, Fecha, ContenedorBotones, BotonAccion, BotonCargarMas, ContenedorBotonCentral, ContenedorSubtitulo, Subtitulo} from '../elementos/ElemntosDeLista';
import {ReactComponent as IconoEditar} from './../imagenes/editar.svg';
import {ReactComponent as IconoBorrar} from './../imagenes/borrar.svg';
import Boton from '../elementos/Boton'
import { Link } from 'react-router-dom';
import borrarCliente from '../firebase/borrarCliente';
import Busqueda from '../elementos/Busqueda';
import { useNavigate } from 'react-router-dom';

const ListaDeClientes = () => {

  const [clientes, obtenerMasClientes, hayMasPorCargar] = useObtenerClientes();
  const [buscar, cambiarBuscar] = useState('')
  const navigate = useNavigate();

  //Función para transformar la fecha de cara al usuario
  
  // const formatearFecha = (fecha) => {
  //   return format(fromUnixTime(fecha), "dd 'de' MMMM 'del' yyyy", {locale: es})
  // }

  const handleChange = (e) =>{

    if(e.target.name === "buscar"){
        cambiarBuscar(e.target.value.replace(/[^0-9.]/g, ''))
    }   
  }

  const handleSubmit =(e) =>{
    e.preventDefault();
    if(buscar !== ''){
      navigate(`/buscar-cliente/${buscar}`)
    } else{
      navigate(`/buscar-cliente/0`)
    }

  }


  const fechaEsIgual = (clientes, index, cliente) => {

    if(index !== 0){


      const fechaActual = cliente.nombres.substr(0,1).toUpperCase();
      const fechaGastoAnterior = clientes[index -1].nombres.substr(0,1).toUpperCase();

      if(fechaActual === fechaGastoAnterior){
        return true;
      } else{
        return false;
      }

    }
  }

    return (
      <>
      <Busqueda buscar={buscar} handleChange={handleChange} handleSubmit={handleSubmit}/>
      <Lista>
        {(clientes).map((cliente, index) => {
          return(
            <div key={index}>
              {!fechaEsIgual(clientes, index, cliente) &&  <Fecha>{cliente.nombres.substr(0,1).toUpperCase()}</Fecha>}
              <ElementoLista key={index}>
                <Categoria>{cliente.nombres} {cliente.apellidos}</Categoria>

                <Descripcion>Doc. {cliente.documento}</Descripcion>
                <Valor>Cel. {cliente.celular}</Valor>

                <ContenedorBotones>
                  <BotonAccion as={Link} to={`/editar/${cliente.id}`}><IconoEditar/></BotonAccion>
                  <BotonAccion onClick={() => {borrarCliente(cliente.id)}}><IconoBorrar /></BotonAccion>
                </ContenedorBotones>
              </ElementoLista>
            </div>
          );
        })}

        {hayMasPorCargar && 
        <ContenedorBotonCentral>
        <BotonCargarMas onClick={() => obtenerMasClientes()}>Cargar más</BotonCargarMas>
        </ContenedorBotonCentral>
        }

        {clientes.length === 0 &&
          <ContenedorSubtitulo>
            <Subtitulo>No hay clientes por mostrar</Subtitulo>
            <Boton as={Link} to="/crear-cliente">Agregar cliente</Boton>
          </ContenedorSubtitulo>
        }
      </Lista>

      </>
      );
}
 
export default ListaDeClientes;