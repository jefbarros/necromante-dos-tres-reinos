# TODO - v0.2.4 - HOTFIX Equipe, Save e Regeneração

## 1. Corrigir limite de equipe ativa
- [ ] Adicionar MAX_ACTIVE_SERVANTS = 3 const
- [ ] Criar normalizeServantRoster() em game.js
- [ ] Chamar após loadGame()
- [ ] Chamar após migrar save

## 2. Corrigir troca de equipe
- [ ] toggleSelectedReserve deve respeitar o limite de 3
- [ ] Enviar excedentes para reserva
- [ ] Mostrar mensagem clara

## 3. Corrigir captura com limite
- [ ] captureSoul deve verificar limite antes de adicionar

## 4. Menu Carregar Save
- [ ] Adicionar opção no menu inicial
- [ ] Criar tela de load
- [ ] Usar SaveManager.loadGame()

## 5. Regeneração
- [ ] Vida do necromante regenera fora de combate
- [ ] Mana regenera
- [ ] Servos regeneram na Cripta Inicial

## 6. PROJECT_STATUS.md
- [ ] Criar arquivo com histórico completo
- [ ] Atualizar README.md

## 7. Versão
- [ ] Atualizar config.js para 0.2.4
