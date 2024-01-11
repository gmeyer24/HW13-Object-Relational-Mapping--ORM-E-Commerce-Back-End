const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagsData = await Tag.findAll({
      // Include associated Products
      include: { model: Product, through: ProductTag, as: 'products' }
    });
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: { model: Product, through: ProductTag, as: 'products' },
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create({ ...req.body });
    res.status(200).json({ message: "Successfully created tag.", tagData });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagToUpdate = await Tag.findByPk(req.params.id)

    if (!tagToUpdate) {
      res.status(404).json({ error: 'Tag not found'});
      return;
    }

   // Update the tag attributes with the new values from the request body
   // Update the tag name
    tagToUpdate.tag_name = req.body.tag_name; 

    // Save the changes to the database
    await tagToUpdate.save();

    res.status(200).json({ message: 'Tag updated successfully', category: tagToUpdate });
  } catch (err) {
    res.status(500).json({ error: 'Error updating tag', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagToDelete = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagToDelete) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully', tagToDelete} );
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
