import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MDBTable, 
  MDBTableBody, 
  // MDBTableHead, 
  MDBRow, MDBCol, 
  MDBContainer,
  MDBBtn,
  MDBBtnGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from "mdb-react-ui-kit"
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(4);
  const [sortFilterValue, setSortFilterValue] = useState('');
  const [operation, setOperation] = useState('');

  const sortOptions = ["nome", "autor", "editora", "categoria"]

  useEffect(() => {
    loadLivrosData(0, 4, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLivrosData = async (start, end, increase, optType=null, filterOrSortValue) => {
    switch(optType) {
      case "search":
        setOperation(optType);
        setSortValue("");
        return await axios.get(`http://localhost:3000/livros?q=${value}&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);                    
          })
          .catch((err) => console.log(err));
        
      case "sort":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return await axios
          .get(`http://localhost:3000/livros?_sort=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);      
          })
          .catch((err) => console.log(err));

      case "filter":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return await axios
          .get(`http://localhost:3000/livros?status=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);      
          })
          .catch((err) => console.log(err));

      default: 
        return await axios.get(`http://localhost:3000/livros?_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
    }
    
  }

  console.log("data", data)
  
  const handleReset = () => {
    setOperation("");
    setValue("");
    setSortFilterValue("");
    setSortValue("");
    loadLivrosData(0, 4, 0);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    loadLivrosData(0, 4, 0, "search")
    // return await axios.get(`http://localhost:3000/livros?q=${value}`)
    // .then((response) => {
    //   setData(response.data);
    //   setValue("");
    // })
    // .catch((err) => console.log(err));
  };

  const handleSort = async (e) => {   
    let value = e.target.value;
    setSortValue(value); 
    loadLivrosData(0, 4, 0, "sort", value)
    // return await axios.get(`http://localhost:3000/livros?_sort=${value}&_order=asc`)
    // .then((response) => {
    //   setData(response.data);
      
    // })
    // .catch((err) => console.log(err));
  };

  const handleFilter = async (value) => { 
    loadLivrosData(0, 4, 0, "filter", value)     
    // return await axios.get(`http://localhost:3000/livros?status=${value}`)
    // .then((response) => {
    //   setData(response.data);
      
    // })
    // .catch((err) => console.log(err));
  };

  const renderPagination = () => {
    if (data.length < 4 && currentPage === 0) return null;
    if(currentPage === 0) {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadLivrosData(4, 8, 1, operation, sortFilterValue)}>
              Próximo
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className='mb-0'>          
            <MDBPaginationItem>
              <MDBBtn 
                onClick={() => 
                  loadLivrosData(
                    (currentPage - 1) * 4, 
                    currentPage * 4, 
                    -1, 
                    operation, 
                    sortFilterValue
                  )
                }
              >
                Anterior
              </MDBBtn>
            </MDBPaginationItem>
            <MDBPaginationItem>
              <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
            </MDBPaginationItem>
        
          <MDBPaginationItem>
            <MDBBtn 
              onClick={() =>
                loadLivrosData(
                  (currentPage + 1) * 4, 
                  (currentPage + 2) * 4, 
                  1, 
                  operation, 
                  sortFilterValue
                )
              }
            >
              Próximo
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else {
      return (
      <MDBPagination className='mb-0'>       
        <MDBPaginationItem>
          <MDBBtn 
            onClick={() => 
              loadLivrosData(
                (currentPage - 1) * 4, 
                currentPage * 4, 
                -1, 
                operation,
                sortFilterValue
              )
            }
          >            
            Anterior
          </MDBBtn>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
      )
    }
  }

  return (
    <MDBContainer>      
      <div style={{marginTop: "50px"}}>
        <h2 className='text-center'>
         Livraria Lamarca
        </h2>
        <form style={{
        margin: 'auto',
        padding: "15px",
        maxWidth: "400px",
        alignContent: "center",
      }}
      className="d-flex input-group w-auto"
      onSubmit={handleSearch}
      >
        <input 
          type="text" 
          className='form-control'
          placeholder='Procure seu livro aqui'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />        
          <MDBBtn className='mx-1' type='submit' color='dark'>Procurar</MDBBtn>
          <MDBBtn className='mx-1' color='info' onClick={() => handleReset()}>Reset</MDBBtn>        
      </form>
        <MDBRow style={{marginTop: "20px"}}>
          <MDBCol size="12">
            <MDBTable>
              {/* <MDBTableHead dark>
                <tr className='text-center'>
                  
                  <th scope='col'>Capa</th>
                  <th scope='col'>Nome</th>
                  <th scope='col'>Autor</th>
                  <th scope='col'>Editora</th>
                  <th scope='col'>Preço</th>
                  <th scope='col'>Status</th>                   
                </tr>
              </MDBTableHead> */}
              {data.length === 0 ? (
                <MDBTableBody className='align-center mb-0'>
                  <tr>
                    <td colSpan={8} className='text-center mb-0'>Não encontrado...</td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr className='align-middle'>                      
                      <td className='text-center'>
                        <img 
                          className="img-fluid img-thumbnail w-50 h-50"                          
                          src={item.capa} 
                          alt={item.nome}
                        />
                      </td>
                      <td>{item.nome}</td>
                      <td>{item.autor}</td>
                      <td>{item.editora}</td>
                      <td>{item.preco}</td>
                      <td>{item.status}</td>
                    </tr>
                  </MDBTableBody>
                ))
              ) }
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div 
        style={{
          margin: 'auto',
          padding: "15px",
          maxWidth: "250px",
          alignContent: "center",
         }}
        >
          {renderPagination()}
        </div>
      </div>
      {data.length > 0 &&  (
        <MDBRow style={{marginBottom: "40px"}}>
          <MDBCol size="8">
            <h5>Ordenar por</h5>
            <select 
            style={{width: "50%", borderRadius: "2px", height: "35px"}}
            onChange={handleSort}
            value={sortValue}
            >
              <option>Por favor, selecione uma opção</option>
              {sortOptions.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </MDBCol>
          <MDBCol size="4">
            <h5>Filtrar por disponibilidade</h5>
            <MDBBtnGroup>
              <MDBBtn color='success' onClick={() => handleFilter("Disponível")}>Disponível</MDBBtn>
              <MDBBtn color='danger' style={{marginLeft: "2px"}} onClick={() => handleFilter("Indisponível")} >Indisponível</MDBBtn>
            </MDBBtnGroup>        
          </MDBCol>
        </MDBRow>
      )}
      
    </MDBContainer>
  );
}

export default App;
