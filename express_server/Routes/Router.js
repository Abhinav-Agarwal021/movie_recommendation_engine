const router = require('express').Router();
const { sendOtp, verifyOtp, activateUser, refresh, logout, getUser, getUserByData } = require('../Controllers/Auth-Controllers')
const { create, getRooms, getRoomId, updateRoom, updateName, deleteRoom } = require('../Controllers/Rooms-Controller');
const authMiddlewares = require('../middlewares/authMiddlewares')

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/activate-user', authMiddlewares, activateUser);
router.get('/refresh', refresh);
router.post('/logout', authMiddlewares, logout)
router.post('/rooms', create);
router.post('/updateRoom', updateRoom)
router.get('/user/:userId', getUser);
router.get('/userData', getUserByData)
router.get('/rooms/:userId', authMiddlewares, getRooms)
router.get('/room/:roomId', getRoomId)
router.post('/grp/delete-server', deleteRoom);
router.post('/grp/update-name', updateName);

module.exports = router;