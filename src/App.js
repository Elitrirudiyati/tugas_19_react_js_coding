import React from 'react';
import './css/bootstrap.min.css';
import Body from './Component/Body';


function App() {
  const [modalShow, setModalShow] = React.useState(false)
  return (
    <div className="App"> 
    
      <Body modalShow={modalShow} setModalShow={setModalShow} />      
    </div>
  );
}

export default App;
