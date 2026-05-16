# Necromante dos Três Reinos

Protótipo jogável v0.2.3 em HTML5, JavaScript e Canvas. O foco é validar um RPG de ação semi-automático mobile-first com necromancia, captura, servos autônomos, gerenciamento de equipe, save local, save em nuvem, sincronização entre dispositivos e suporte híbrido Web/Android/Windows.

## Como Rodar

Abra `index.html` diretamente no navegador.

Também pode usar um servidor estático:

```bash
python -m http.server 8000
```

Depois accesses `http://localhost:8000`.

## Controles

PC:

- WASD ou setas: mover.
- J ou Espaço: ataque básico.
- 1: Dreno de Alma.
- 2: Lança Osséa.
- 3: Marca da Submissão.
- 4: Explosão Cadavérica.
- C: Capturar Alma ou confirmar em menus.
- Q: alternar comando dos servos ou opção selecionada em menus.
- M: gerenciamento de servos.
- I: inventário/equipamentos/reputação.
- K: árvore de habilidades.
- P: salvar.
- Esc: menu principal.
- E: entrar em portal ou interagir com objeto próximo.
- Enter: confirmar no menu principal ou entrar no mapa.
- F: fusão na tela de servos.
- X: apagar save local.

Mobile:

- Joystick virtual à esquerda.
- Botões de ataque, habilidades, captura e comando à direita.
- Botões superiores: Menu, Equipe, Inventário, Talentos, Salvar e Mapa.
- Botão contextual Entrar aparece perto de portais.
- Botão contextual Interagir aparece perto de objetos.
- Em menus, use CMD para alternar seleção e CAP/ATK para confirmar.

Se o necromante estiver perto de um portal e de um objeto ao mesmo tempo, o alvo mais próximo é priorizado.

## Sistemas Mantidos

- Movimentação do necromante.
- Combate com projéteis e habilidades.
- Captura com primeira captura garantida.
- Até 3 servos ativos.
- Comandos gerais dos servos.
- IA autônoma de servos.
- Aprendizado contra agrupamento após dano em área.
- Chefe Guardião de Tumba.
- Evolução de Esqueleto Guerreiro para Esqueleto Veterano.
- Área secreta desbloqueável.
- Morte e renascimento na Cripta Inicial.
- HUD funcional.
- Menu, equipe, inventário, talentos, reputação, save/load e fusão.
- Mapas independentes com portais, spawn por origem, fade de transição e câmera por mapa.
- Minimap.
- Pontos de interesse interativos.
- Respawn de inimigos.
- Estado por mapa persistido.

## Sistemas Adicionados na v0.2.3

- **Tela de Conta**: Menu de gerenciamento de conta, login, logout, sincronização.
- **Detecção de Plataforma**: Identifica web, android ou windows automaticamente.
- **Device ID**: Identificador único persistente por dispositivo.
- **Save em Nuvem (Mock)**: Simulação de save em nuvem para testes sem Firebase.
- **Sincronização**: Syncnow para enviar/receber saves entre local e nuvem.
- **Exportar/Importar Save**: JSON para backup externo.
- **Indicador de Sync na HUD**: Mostra status local/nuvem/sincronizando/pendente/offline.
- **Autosave com Debounce**: Salva automaticamente após mudanças importantes.
- **Preparação para Capacitor**: Estrutura pronta para build Android.
- **Preparação para Tauri**: Estrutura pronta para build Windows.

## Arquitetura Híbrida

### Save Local (localStorage)

O save local funciona sem internet ou conta:

- `SaveManager.saveGame()` - Salva localmente.
- `SaveManager.loadGame()` - Carrega save local.
- `SaveManager.deleteLocalSave()` - Apaga save local.
- `SaveManager.hasLocalSave()` - Verifica existência.

### Save em Nuvem (Cloud)

Dois modos disponíveis:

1. **mockCloud** (padrão): Simula save em nuvem usando localStorage separado. Usa para desenvolvimento sem Firebase configurado.

2. **Firebase**: Integre com Firebase Firestore quando `firebaseConfig.local.js` existir.

### Conta de Jogador

Estados:

- **guest**: Não logado, usa save local apenas.
- **loggedIn**: Logado, pode sincronizar com nuvem.
- **offline**: Sem conexão, salva local e marca pendente.
- **error**: Erro de conexão/auth.

Mock login disponível para testes:

```js
// Mock sign in
AuthService.signInWithMock();

// Check status
AuthService.isLoggedIn();
AuthService.getCurrentUser();
```

### Sincronização

Regras de sync:

- Se não logado: salva apenas local.
- Se logado e online: salva local e envia para nuvem.
- Se offline: salva local e marca sync pendente.
- Quando voltar online: sincroniza automaticamente.
- Conflito: abre tela de resolução.

## Detecção de Plataforma

O jogo detecta automaticamente:

- **web**: Navegador padrão.
- **android**: Mobile Android ou iOS.
- **windows**: Desktop Windows/Mac/Linux.

Também detecta wrappers nativos:

- Capacitor (window.Capacitor)
- Tauri (window.__TAURI__)

Display na HUD: `web | guest` ou `android | Logado`.

## Como Testar Conta e Sync

1. Inicie Novo Jogo.
2. Vá ao menu principal e selecione "Conta".
3. Shows show informações de estado, plataforma e device ID.
4. Pressione **1** ou **Menu** para fazer mock login (Convidado → Logado).
5. Pressione **2** para sincronizar (Syncnow).
6. Pressione **P** para exportar save para console.
7. Pressione **Mapa/Enter** para voltar ao menu.

## Como Testar Export/Import

1. Na tela de Conta, pressione **P**.
2. O save JSON será logged no console do navegador.
3. Copie o JSON inteiro.
4. Para importar, no console:

```js
var json = "COLE_AQUI_O_JSON";
SaveManager.importSave(json);
```

5. O jogo recarregará com o save importado.

## Como Testar Conflito de Save

1. Faça login mock.
2. Salve localmente.
3. Altere o save na nuvem (simule outro dispositivo).
4. Execute Syncnow.
5. Se houver conflito, escolha:

- **Usar save local**: Mantém o save do dispositivo atual.
- **Usar save nuvem**: Baixa o save da nuvem.
- **Cancelar**: Aborta a sincronização.

## Preparação para Capacitor (Android)

Para criar build Android com Capacitor:

```bash
# Instalar dependências
npm install
npm install @capacitor/core @capacitor/android

# Inicializar Capacitor (uma vez)
npx cap init "Necromante dos Três Reinos" "com.necromante.tresreinos"

# Adicionar Android
npx cap add android

# Sincronizar
npx cap sync android

# Abrir Android Studio
npx cap open android
```

Nota: A pasta `android/` não é criada nesta versão. Execute os comandos acima quando o ambiente estiver pronto.

## Preparação para Tauri (Windows)

Para criar build Windows com Tauri:

```bash
# Criar package.json
npm init -y

# Instalar Tauri CLI
npm install -D @tauri-apps/cli

# Inicializar Tauri (uma vez)
npm run tauri init

# Build
npm run tauri build
```

Nota: A pasta `src-tauri/` não é criada nesta versão. Execute os comandos acima quando Rust/Tauri estiver instalado.

## Segurança - Nunca Commite Segredos

Arquivos que NÃO devem ser commitados:

- `src/firebaseConfig.local.js` - Credenciais reais do Firebase.
- `.env` / `.env.local` - Variáveis de ambiente.
- `node_modules/` - Dependências npm.
- `dist/` - Build de produção.
- `android/` - Build Android.
- `src-tauri/target/` - Build Tauri.

O `.gitignore` já está configurado para ignorar esses arquivos.

## Estrutura de Arquivos

```
src/
├── config.js        - Configurações do jogo.
├── platform.js    - Detecção de plataforma e device ID.
├── localSave.js   - Save local (localStorage).
├── cloudSave.js   - Save em nuvem (mock/Firebase).
├── auth.js       - Autenticação (mock/Firebase).
├── syncManager.js - Sincronização entre local e nuvem.
├── saveManager.js - Camada unificada de save.
├��─ input.js     - Entrada de usuário.
├── map.js       - Mapas e portais.
├── entities.js  - Entidades do jogo.
├── ai.js       - IA de servos e inimigos.
├── ui.js       - Interface Visual.
├── game.js     - Lógica principal.
├── main.js     - Inicialização.
├── firebaseConfig.example.js  - Exemplo de config Firebase.
└── firebaseConfig.local.js  - (NÃO COMMITTED) Sua config Firebase.

index.html     - HTML principal.
styles.css    - Estilos.
README.md    - Este arquivo.
package.json  - Scripts npm.
```

## Scripts do package.json

```json
{
  "scripts": {
    "dev": "python -m http.server 8000",
    "start": "python -m http.server 8000"
  }
}
```

Para desenvolvimento: `npm run dev`

Para verificar JavaScript: `node --check src/*.js`

## Migração de Saves Antigos

O SaveManager detecta automaticamente saves da v0.2.2 e earlier e migra para o novo schema:

- `schemaVersion`: "0.2.3"
- `player`, `servants`, `inventory`, etc: mantidos.

Saves antigos funcionam normalmente com "Continuar".

## Checklist de Validação

- [ ] Jogo abre no navegador sem erros.
- [ ] node --check passa em todos os arquivos JS.
- [ ] Save local funciona.
- [ ] Saves antigos da v0.2.2 são migrados.
- [ ] Plataforma detectada e mostrada.
- [ ] Device ID persistente gerado.
- [ ] Tela de Conta acessível.
- [ ] Modo convidado funciona.
- [ ] Mock login funciona.
- [ ] Mock cloud save funciona.
- [ ] Syncnow envia/baixa save.
- [ ] HUD mostra status de sync.
- [ ] Autosave funciona com debounce.
- [ ] Export save gera JSON válido.
- [ ] Import save substitui após confirmação.
- [ ] Conflito de save mostra escolha.
- [ ] Nenhum sistema anterior removido.
- [ ] README atualizado com híbrida, conta, sync.

## Suporte a múltiplas plataformas

O jogo detecta automaticamente onde está rodando:

- **Web**: Abra `index.html` no navegador.
- **Android**: Build com Capacitor (futuro).
- **Windows**: Build com Tauri (futuro).

O save local funciona em qualquer plataforma. O save em nuvem permitirá sincronização entre dispositivos.

## Autores

Protótipo original criado em HTML5, JavaScript e Canvas. Visual simbólico feito apenas com formas, texto e partículas simples, sem assets externos obrigatória.

---

Para dúvidas ou contribuições, abra uma issue no repositório.
