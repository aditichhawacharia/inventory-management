'use client'

import { useState, useEffect } from 'react'
import { Container, Box, Button, TextField, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

// Define the custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Custom primary color
    },
    secondary: {
      main: '#dc004e', // Custom secondary color
    },
    background: {
      default: '#f5f5f5', // Light grey background color
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Custom font
    h2: {
      fontWeight: 400, // Adjusted font weight for h2
      fontSize: '2rem', // Smaller font size for Pantry Management
      color: '#000', // Black color for the title
    },
    h4: {
      fontWeight: 700, // Custom font weight for h4
    },
    button: {
      textTransform: 'none', // Disable uppercase transformation for buttons
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5', // Ensure the entire body has the light grey background
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          width: '100%',
          fontFamily: 'Poppins, sans-serif', // Apply Poppins font globally
        },
        html: {
          height: '100%',
          fontFamily: 'Poppins, sans-serif', // Apply Poppins font globally
        },
        '*': {
          fontFamily: 'Poppins, sans-serif', // Apply Poppins font to all elements
        },
      },
    },
  },
})

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [editingQuantity, setEditingQuantity] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async () => {
    if (!itemName || !quantity) return

    const docRef = doc(collection(firestore, 'inventory'), itemName)
    const docSnap = await getDoc(docRef)
    const quantityNumber = parseInt(quantity, 10)

    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data()
      await setDoc(docRef, { quantity: existingQuantity + quantityNumber })
    } else {
      await setDoc(docRef, { quantity: quantityNumber })
    }

    setItemName('')
    setQuantity('')
    await updateInventory()
  }

  const startEditing = (item, currentQuantity) => {
    setEditingItem(item)
    setEditingQuantity(currentQuantity.toString()) // Set the editing quantity state
  }

  const saveEdit = async () => {
    if (!editingItem || !editingQuantity) return

    const docRef = doc(collection(firestore, 'inventory'), editingItem)
    const quantityNumber = parseInt(editingQuantity, 10)

    await setDoc(docRef, { quantity: quantityNumber })

    setEditingItem(null)
    setEditingQuantity('')
    await updateInventory()
  }

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await deleteDoc(docRef)
    await updateInventory()
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          padding={4}
          bgcolor="transparent"
        >
          {/* Logo Section */}
          <Box mb={4} textAlign="center">
            <img
              src="https://i.pinimg.com/736x/bd/d6/3b/bdd63ba5c30cd9f5a6252f0cb0077e8d.jpg"
              alt="Pantry Tracker Logo"
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </Box>

          <Typography variant="h2" align="center" gutterBottom style={{ fontWeight: 700 }}>
            Pantry Management
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            mt={4}
            justifyContent="center"
          >
            <Box textAlign="center">
              <Typography variant="caption" display="block" gutterBottom>
                Item Name
              </Typography>
              <TextField
                variant="outlined"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ width: '150px', fontSize: '0.875rem', textAlign: 'center' }}
                InputProps={{
                  sx: {
                    height: '40px',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                }}
              />
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" display="block" gutterBottom>
                Quantity
              </Typography>
              <TextField
                variant="outlined"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                sx={{ width: '100px', fontSize: '0.875rem', textAlign: 'center' }}
                InputProps={{
                  sx: {
                    height: '40px',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={addItem}
              sx={{ minWidth: '80px', height: '30px' }}
            >
              ADD ITEM
            </Button>
          </Stack>
          <Box mt={4} width="100%">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map(({ name, quantity }) => (
                    <TableRow key={name}>
                      <TableCell component="th" scope="row">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </TableCell>
                      <TableCell align="right">
                        {editingItem === name ? (
                          <TextField
                            variant="outlined"
                            type="number"
                            value={editingQuantity} // Use editingQuantity here
                            onChange={(e) => setEditingQuantity(e.target.value)} // Update editingQuantity state
                            sx={{ width: '100px', fontSize: '0.875rem', textAlign: 'center' }}
                            InputProps={{
                              sx: {
                                height: '40px',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                              },
                            }}
                          />
                        ) : (
                          quantity
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row-reverse" spacing={2}>
                          {editingItem === name ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={saveEdit}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => startEditing(name, quantity)}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => deleteItem(name)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
