import "./App.css";
import { useCreateEnterprise } from "./services/AccountServices";
import UserPage from "./pages/UserPage";

function App() {
  const createAccount = useCreateEnterprise();
  const DEFALUT_TAX_ID = "7162828483";

  return (
    <div className="App">
      <header className="App-header">
        <h3>example Tax ID: 7162828483 </h3>
        <button
          type="button"
          onClick={() => {
            createAccount.mutateAsync({
              taxId: DEFALUT_TAX_ID,
              userHashes: ["0xHash1", "0xHash2"],
              permissions: ["perm1", "perm2"],
            });
          }}
        >
          {createAccount.isPending ? "Loading..." : "Create Enterprise"}
        </button>
      </header>
      {<UserPage taxId={DEFALUT_TAX_ID} />}
    </div>
  );
}

export default App;
