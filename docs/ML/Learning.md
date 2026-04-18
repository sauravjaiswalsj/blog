# ML 101

# ML Modules:

1. matplotlit : Generates graphs and plots.
2. Pandas : Data manipulation and analysis. (loads/works with tabular data)
3. Numpy : Numerical operations.
4. Scikit-learn : Machine learning algorithms. Perfoms ml
5. scipy : Scientific computing and statistics functions.
6. nltk : Natural Language Processing. (works with text data)
7. Deep learning framewor : tensorflow, keras, pytorch, jax, theano, mxnet
8. XGBoost, LightGBM, CatBoost, AdaBoost, Bagging, Stacking, Elastic Net
9. Statistical modeling and econometrics: statsmodels


```python
import pandas as pd
from matplotlib import pyplot as plt

df = pd.read_csv('letter_freq.csv')
plt.plot(df.letter_index, df.frequency, label='Ransom')
plt.plot(df.letter_index, df.frequency, label='English')
plt.legend()
plt.show()
```

`pd.read_csv()` : reads the csv file and returns a dataframe(table).
`plt.plot(x, y, label)` : plots the graph with x and y axis and label.
`plt.legend()` : shows the legend.
`plt.show()` : shows the plot.
`plt.scatter(x, y, label)` : plots the scatter plot with x and y axis and label.
`plt.hist(x, label)` : plots the histogram with x and y axis and label.
`plt.bar(x, y, label)` : plots the bar graph with x and y axis and label.
`plt.pie(x, label)` : plots the pie chart with x and y axis and label.
`plt.boxplot(x, label)` : plots the box plot with x and y axis and label.
`plt.text(x, y, label)` : adds text to the plot.
`plt.title(label)` : adds title to the plot.
`plt.xlabel(label)` : adds x-axis label to the plot.
`plt.ylabel(label)` : adds y-axis label to the plot.
`plt.grid(label)` : adds grid to the plot.
`plt.legend(label)` : adds legend to the plot.
`plt.show()` : shows the plot.


## Pandas:
- Module to work with tabular data.
- Loading tabular data from different sources
- Search for particular rows or columns
- Calculate aggregate stats
- Combining data from multiple sources

### Creating data
There are two core objects in pandas: the DataFrame and the Series.

1. DataFrame
A DataFrame is a table. It contains an array of individual entries, each of which has a certain value. Each entry corresponds to a row (or record) and a column.

2. Series
A Series, by contrast, is a sequence of data values. If a DataFrame is a table, a Series is a list. And in fact you can create one with nothing more than a list:


`pd.Series([1, 2, 3, 4, 5])` : creates a series with values 1, 2, 3, 4, 5.
`pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])` : creates a series with values 1, 2, 3, 4, 5 and index 'a', 'b', 'c', 'd', 'e'.
`pd.Series({'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5})` : creates a series with values 1, 2, 3, 4, 5 and index 'a', 'b', 'c', 'd', 'e'.
`pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'], name='my_series')` : creates a series with values 1, 2, 3, 4, 5 and index 'a', 'b', 'c', 'd', 'e' and name 'my_series'.
`pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'], name='my_series', dtype='float64')` : creates a series with values 1, 2, 3, 4, 5 and index 'a', 'b', 'c', 'd', 'e' and name 'my_series' and dtype 'float64'.
`pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'], name='my_series', dtype='float64', copy=True)` : creates a series with values 1, 2, 3, 4, 5 and index 'a', 'b', 'c', 'd', 'e' and name 'my_series' and dtype 'float64' and copy=True.
`pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'], name='my_series', dtype='float64', copy=True, fastpath=True)` : creates a series with values 1, 2, 3, 4, 5 and index 'a', 'b', 'c', 'd', 'e' and name 'my_series' and dtype 'float64' and copy=True and fastpath=True.

`pd.drop_duplicates()` : drops duplicate values from a series.
`pd.drop(labels, axis=0, inplace=False, errors='raise')` : drops labels from a series.
axis = 0 : drop rows
axis = 1 : drop columns

