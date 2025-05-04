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

    PC = 0x200
    DT = 0
    ST = 0
    I = 0
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
    for(let i = 0; i < 32; i++){
        dis.push([])
        for(let x = 0; x < 64; x++){
        }
    }

    for(let i = 0; i < 8; i++){
        api.setBlockRect([i*8, 0, 0], [i*8 + 8, 32, 0])
    }
}

function DXYN(x,y,n){
    let x = regs[x] & 63
    let y = regs[y] & 31
    regs[0xF] = 0
    for(let h = 0; h < 16; h++){
        let data = ram[I + h].toString(2)
        for(let m = 0; m < 8; m++){
            if(dis[y][x + m] == 1){
                regs[0xF] = 1
            }
            dis[y][x+m] ^= +data[m]
            api.setBlock(x + m, 32 - y, dis[y][x+m])
        }
    }
}

function interpret(){
    let opCode = ram[PC]
    let prefix = opCode & 0xF000
    let X = opCode & 0x0F00
    let Y = opCode & 0x00F0
    let N = opCode & 0x000F
    let NN = opCode & 0x00FF
    let NNN = opCode & 0x0FFF

    switch( prefix ){
        case 0:
            for(let i = 0; i < 8192; i++){
                display[i] = 0
            }
            break
        case 1:
            PC = NNN
            break
        case 6:
            regs[X] = NN
            break
        case 7:
            regs[X] += NN
            break
        case 10:
            I = NNN
        case 13:
            DXYN(X,Y,N)
            
    }
    
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
