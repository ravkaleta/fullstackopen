import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
    const dispatch = useDispatch()

    return (
        <>
            filter <input onChange={(event) => dispatch(filterChange(event.target.value))}/>
        </>
    )
}

export default Filter