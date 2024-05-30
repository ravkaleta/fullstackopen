const Note = ({ note, handleClick}) => {
    return (
        <li 
            key={note.id}
            onClick={handleClick}  
        >
            {note.content} <strong> {note.important ? 'important' : ''}</strong>
        </li>
    )
}

export default Note