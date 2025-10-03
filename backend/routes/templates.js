const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Initialize Firebase Admin (using your service account)
if (!admin.apps.length) {
  const serviceAccount = require('../serviceaccountkey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'salon-database-464315'
  });
}

const db = admin.firestore();

// GET /api/templates - Get all templates from Firestore
router.get('/', async (req, res) => {
  try {
    const templatesSnapshot = await db.collection('templates').get();
    const templates = [];
    
    templatesSnapshot.forEach(doc => {
      templates.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Found ${templates.length} templates in Firestore`);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates from Firestore:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// GET /api/templates/:id - Get single template from Firestore
router.get('/:id', async (req, res) => {
  try {
    const templateDoc = await db.collection('templates').doc(req.params.id).get();
    
    if (!templateDoc.exists) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const template = {
      id: templateDoc.id,
      ...templateDoc.data()
    };
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching template from Firestore:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// POST /api/templates - Create new template in Firestore
router.post('/', async (req, res) => {
  try {
    const { name, subject, contentHtml, contentText, placeholders, category } = req.body;
    
    if (!name || !subject) {
      return res.status(400).json({ error: 'Name and subject are required' });
    }

    const templateData = {
      name,
      subject,
      contentHtml: contentHtml || '',
      contentText: contentText || '',
      placeholders: placeholders || [],
      category: category || 'custom',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    const docRef = await db.collection('templates').add(templateData);
    
    console.log('Template saved to Firestore with ID:', docRef.id);
    console.log('Template data:', templateData);
    
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('Error creating template in Firestore:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// PUT /api/templates/:id - Update template in Firestore
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('templates').doc(req.params.id).update(updateData);
    
    console.log('Template updated in Firestore:', req.params.id);
    res.status(200).json({ message: 'Template updated successfully' });
  } catch (error) {
    console.error('Error updating template in Firestore:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// DELETE /api/templates/:id - Delete template from Firestore
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('templates').doc(req.params.id).delete();
    
    console.log('Template deleted from Firestore:', req.params.id);
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template from Firestore:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

module.exports = router;
