const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoriesData = await Category.findAll({
      // Include associated Products
      include: { model: Product }, 
    });
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const cateogryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!cateogryData) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    res.status(200).json(cateogryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create({ ...req.body });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryToUpdate = await Category.findByPk(req.params.id)

    if (!categoryToUpdate) {
      res.status(404).json({ error: 'Categry not found'});
      return;
    }

   // Update the category attributes with the new values from the request body
   // Update the category name
    categoryToUpdate.category_name = req.body.category_name; 

    // Save the changes to the database
    await categoryToUpdate.save();

    res.status(200).json({ message: 'Category updated successfully', category: categoryToUpdate });
  } catch (err) {
    res.status(500).json({ error: 'Error updating category', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryToDelete = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryToDelete) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryToDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
