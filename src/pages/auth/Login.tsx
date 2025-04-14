
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<"client" | "professional">("client");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro("");

    const { success, error } = await login(email, senha, role);

    if (!success && error) {
      setErro(error);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
            required
          />
        </div>
        
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
            required
          />
        </div>
        
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Entrar como:</label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value as "client" | "professional")}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="client">Cliente</option>
            <option value="professional">Profissional</option>
          </select>
        </div>
        
        {erro && <p style={{ color: "red", marginBottom: "1rem" }}>{erro}</p>}
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: "100%", 
            padding: "0.5rem", 
            backgroundColor: "#4a90e2", 
            color: "white", 
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
