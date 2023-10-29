export const RoomMenu = () => {
    return (
        <div className="card" style={{ width: '60%' }}>
            <img className='doodles' src={doodles} alt="" />
            <div className='inCard'>
                <p style={{
                    color: 'var(--accent)',
                    fontSize: '3rem',
                }}>+</p>
                <input
                    placeholder='Nombre de la sala'
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <button
                    className='primary'
                    style={{
                        fontSize: '1rem',
                        padding: '1rem'
                    }}
                    onClick={handleCreateRoom}
                >
                    <p>Crear</p>
                </button>
            </div>
            <hr />
            {rooms.length == 0 ? <p>No hay salas creadas</p> :
                rooms.map((room, index) => (
                    <div className='inCard' key={index} style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img style={{ height: '1rem', marginRight: '1rem' }} src={ellipse} alt="" />
                            <div>
                                <p style={{ fontSize: '2rem' }}>{room.name}</p>
                                <p style={{ color: '#A0A0A0' }}>Clásico</p>
                            </div>
                        </div>
                        <button className='secondary' id={room.id} onClick={handleJoinRoom}>Join</button>
                    </div>
                ))}
        </div>
    )
}
