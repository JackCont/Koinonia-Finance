# Tesouraria IEAD - Correção do Erro 404

## Problema Identificado

O erro 404 ocorria porque o `INICIAR.bat` estava abrindo o navegador **antes** do servidor estar pronto.

## Correção Aplicada

1. **INICIAR.bat** agora executa apenas `python iniciar.py`
2. **iniciar.py** foi corrigido para:
   - Mudar para a pasta `dist` antes de iniciar o servidor
   - Iniciar o servidor HTTP
   - Abrir o navegador automaticamente após 1.5 segundos (quando o servidor já está pronto)

## Como Usar Agora

### Método 1 (Recomendado):
```
Clique duas vezes em: INICIAR.bat
```

O navegador abrirá automaticamente em: http://localhost:8080

### Método 2 (Manual):
```bash
python iniciar.py
```

## Se Ainda Der Erro 404

1. **Verifique se a pasta dist existe e tem arquivos:**
   - Deve conter: `index.html`, `assets/`

2. **Se a pasta dist estiver vazia:**
   ```bash
   npm run build
   ```

3. **Se o servidor não iniciar:**
   - Verifique se a porta 8080 está livre
   - Tente outra porta editando `iniciar.py` (linha 7: `PORT = 8080`)

4. **Se o Python não for encontrado:**
   - Verifique se está no PATH
   - Tente: `py iniciar.py` ou `python3 iniciar.py`

## Estrutura Correta

```
projeto/
├── INICIAR.bat          ← Executar este
├── iniciar.py           ← Script do servidor
├── dist/                ← Aplicativo compilado
│   ├── index.html
│   └── assets/
│       ├── index-*.js
│       └── index-*.css
└── src/                 ← Código fonte
```

## Login

- Usuário: `admin`
- Senha: `admin123`
