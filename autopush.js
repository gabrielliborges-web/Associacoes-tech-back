const { execSync } = require("child_process");

const args = process.argv.slice(2);
const mensagem = args[0];
const branch = args[1];

if (!mensagem) {
  console.error("❌ Você precisa fornecer uma mensagem de commit!");
  console.error('Exemplo: npm run autopush "ajuste na tela de login" main');
  process.exit(1);
}

if (!branch) {
  console.error("❌ Você precisa fornecer a branch!");
  console.error('Exemplo: npm run autopush "ajuste na tela de login" main');
  process.exit(1);
}

try {
  // console.log("Executando npm run build...");
  // execSync("npm run build", { stdio: "inherit" });

  console.log("🚀 Executando git add...");
  execSync("git add .", { stdio: "inherit" });

  console.log(`🚀 Executando git commit -m "${mensagem}"...`);
  execSync(`git commit -m "${mensagem}"`, { stdio: "inherit" });

  console.log(`🚀 Executando git push origin ${branch}...`);
  execSync(`git push origin ${branch}`, { stdio: "inherit" });

  console.log("✅ Push realizado com sucesso!");
} catch (error) {
  console.error("❌ Ocorreu um erro durante o autopush.");
  process.exit(1);
}
