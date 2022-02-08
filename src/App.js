import { useEffect } from "react";
import { actions } from "./store"
import { useSelector } from 'react-redux';
import './App.css';
import User from "./User"


const App = () => {

 const { users = {} } = useSelector(() => actions.get("state", {})) 
 const { clonedUsers = {} } = useSelector(() => actions.get("clonedState", {}))
 const { search = "" } = useSelector(() => actions.get("searchState", {}))
 const { clonedSearch = {} } = useSelector(() => actions.get("clonedSearchState", {}))
 const { sort = { field: "", order: "" } } = useSelector(() => actions.get("sortState", {}))
 const { clonedSort = { field: "", order: "" } } = useSelector(() => actions.get("clonedSortState", {}))
 const { checkedUsers = {} } = useSelector(() => actions.get("checkedState", {}))
 const { clonedCheckedUsers = {} } = useSelector(() => actions.get("clonedCheckedState", {}))

 const headers = ["name", "username"]
 const headersTwo = ["name", "username"]

  const filteredUsers = users.filter(value => (
   value.name.toLowerCase().includes(search.toLowerCase()) ||
   value.username.toLowerCase().includes(search.toLowerCase())
 ))


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users")
      const data = await response.json()
      const dataObject = data.reduce((acc, user) => {
        acc[user.id] = user
        return acc
      }, {})
      actions.set('state.users', dataObject)
    }
    fetchData()
  },[])
  
  return (
    <div className="App">
      <div className="tables">
        <div className="table">
          <table>
            <tr>
              <input
                className="search"
                type="search"
                placeholder="  Type here"
                onChange={event => actions.set("searchState.search", event.target.value)}
              />
            </tr>
            <tr> 
            <th>id</th>
            {headers.map((header) => (
              <th key={header}>
                <button
                  onClick={() => {
                    if (header !== sort.field) {
                      actions.set("sortState.sort", {field: header, order: "ASC"})
                    } else if ( sort.order === "ASC") {
                      actions.set("sortState.sort", {field: header, order: "DSC"})
                    } else {
                      actions.set("sortSteate.sort", {})
                    }
                  }}
                > 
                  {header}
                </button>
                {header === sort.field &&
                    <span>
                      {sort.order === "DSC"
                        ? " 🔽"
                        : " 🔼"
                      }
                    </span>
                  }
              </th>
            ))}
            </tr>
            {filteredUsers
              .sort((a, b) => {
                const orderModifier = sort.order === "DSC"
                  ? -1
                  : 1
                if (sort.field) {
                  return a[sort.field].localeCompare(b[sort.field]) * orderModifier
                }
              })
              .map(user => (
                <User
                  key={user.id}
                  user={user}
                  checked={checkedUsers[user.id]}
                  onCheck={() => {
                    actions.set("checkedState.checkedUsers", {...checkedUsers, [user.id]: !checkedUsers[user.id]})
                  }}
                />
              ))
            }
          </table>
        </div>
      </div>
      {/* {Object.values(users).map(({ id, name, username, email }) => (
        <p onClick={() => actions.set(`state.users.${id}.name`, "Jose")} key={id}> {id} {name} {email} {username} </p>
      ))} */}
    </div>
  )
}

export default App;
