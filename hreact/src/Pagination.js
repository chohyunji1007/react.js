export function Pagination({
  postsNum,
  postsPerPage,
  setCurrentPage,
  currentPage
}) {
  const pageList = [];
  const totalPages = Math.ceil(postsNum / postsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageList.push(i);
  }

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  if (totalPages === 1) {
    return null;
  }

  return (
    <div className="pagination" style={{zIndex:'0'}}>
      <div className="page-item">
      <button className='page-link' onClick={goToPrevPage} disabled={currentPage === 1} style={currentPage === 1 ? {color:'gray'} :{color : '#59705d'}}>
        
        { '<' }
      </button>
      </div>
      

      {pageList.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={currentPage === page ? "active page-link" : "page-link"}
          style={currentPage === page ? {backgroundColor:'#AFC8AD', borderColor : '#AFC8AD'} : {color : '#59705d'}}
        >
          {page}
        </button>
      ))}
      <div className="page-item">
      <button className='page-link' onClick={goToNextPage} disabled={currentPage === pageList.length} style={currentPage === pageList.length ? {color:'gray'} : {color : '#59705d'}}>
        { '>' }
      </button>
      </div>
      
    </div>

    // <nav className="hpage">
    //   <ul className="pagination">
    //     <li className="page-item">
    //       <a className="page-link" onClick={goToPrevPage} disabled> {'<'} </a>
    //     </li>

    //     {pageList.map((page) => (
    //     <li
    //       key={page}
    //       onClick={() => setCurrentPage(page)}
    //       className={currentPage === page ? "active page-link" : "page-link"}
    //       // style={currentPage === page ? {backgroundColor:'gray'} : null}
    //     >
    //       {page}
    //     </li>
    //   ))}

    //     <li className="page-item">
    //       <a className="page-link" onClick={goToNextPage} disabled={currentPage === pageList.length}> {'>'} </a>
    //     </li>
    //   </ul>
    // </nav>
  );
}