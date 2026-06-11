namespace algorithms_visualizer.Models.Algorithms
{
    public class CategoryListItemViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public int AlgorithmsCount { get; set; }
    }
}
