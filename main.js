rom = [] // INSERT ROM HERE
state = "OFF"
function setMem(){
    ram = []
    for(let i = 0; i < 4096; i++){
        ram.push(0)
    }

    regs = []
    for(let i = 0; i < 16; i++){
        regs.push(0)
    }

    PC = 0
    DT = 0
    ST = 0
}

function insertROM(){
    for(let i = 0; i < rom.length; i++){
        ram[i + 0x200] = rom[i]
    }
}

function resetDisplay(){
    OFF = "White Concrete"
    ON = "Black Concrete"
    
    dis = []
    for(let i = 0; i < 8192; i++){
        dis.push(0)
    }

    for(let i = 0; i < 8; i++){
        api.setBlockRect([i*8, 0, 0], [i*8 + 8, 32, 0])
    }
}

function interpret(){
    let opCode = ram[0x200 + PC]
    let prefix = opCode & 0xF000
    let X = opCode & 0x0F00
    let Y = opCode & 0x00F0
    let N = opCode & 0x000F
    let NN = opCode & 0x00FF
    let NNN = opCode & 0x0FFF

    
    
}


function tick(){
    switch (state){
        case "OFF":
            setMem()
            state = "ON"
            break
        case "ON":
            insertRom()
            state = "DRAWING"
            break
        case "DRAWING":
            resetDisplay()
            state = "RUNNING"
            break
        case "RUNNING":
            PC++
            if(DT > 0){
                DT--
            }
            if(ST > 0){
                ST--
            }
            interpret()
            break
    }
}
