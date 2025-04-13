import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [tipo, setTipo] = useState(""); // cliente ou profissional
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
  const [erro, setErro] = useState("");

  const handleCadastro = async (e: any) => {
    e.preventDefault();

    if (!nome || !email || !senha || !telefone || !cpfCnpj || !tipo) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      setErro("Erro ao criar conta: " + error.message);
      return;
    }

    const userId = data.user?.id;

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        nome,
        email,
        telefone,
        cpf_cnpj: cpfCnpj,
        tipo,
        endereco: tipo === "profissional" ? endereco : null,
        cep: tipo === "profissional" ? cep : null,
      },
    ]);

    if (insertError) {
      setErro("Erro ao salvar dados do usuário.");
      return;
    }

    router.push("/auth/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
      {erro && <p className="text-red-500">{erro}</p>}
      <form onSubmit={handleCadastro} className="space-y-4">
        <input type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} className="border p-2 w-full" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" required />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="border p-2 w-full" required />
        <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="border p-2 w-full" required />
        <input type="text" placeholder="CPF ou CNPJ" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} className="border p-2 w-full" required />
        
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="border p-2 w-full" required>
          <option value="">Selecione o tipo de usuário</option>
          <option value="cliente">Cliente</option>
          <option value="profissional">Profissional</option>
        </select>

        {tipo === "profissional" && (
          <>
            <input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="border p-2 w-full" required />
            <input type="text" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} className="border p-2 w-full" required />
          </>
        )}

        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Cadastrar</button>
      </form>
    </div>
  );
}
