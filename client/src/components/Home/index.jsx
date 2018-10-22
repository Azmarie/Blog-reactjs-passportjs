import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Form } from '../../components/Article';
import moment from 'moment';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        const { onLoad } = this.props;

        axios('http://localhost:8000/api/articles')
            .then((res) => {
                console.log(res.data);
                onLoad(res.data)
            })
            .catch((error) => {
                if(error.response.status === 401) {
                  this.props.history.push("/login");
                }
            });
    }

    logout = () => {
        localStorage.removeItem('jwtToken');
        window.location.reload();
      }

    handleDelete(id) {
        const { onDelete } = this.props;

        return axios.delete(`http://localhost:8000/api/articles/${id}`)
            .then(() => {
                console.log(id),
                onDelete(id)
            });
    }

    handleEdit(article) {
        const { setEdit } = this.props;
        setEdit(article);
    }

    render() {
        const { articles } = this.props;
        return (
            <div className="container">
                <div className="row pt-5">
                    <div className="col-12 col-lg-6 offset-lg-3">
                        <h1 className="text-center">Blog</h1>
                        {localStorage.getItem('jwtToken') && 
                            <button className="btn btn-primary" 
                            onClick={this.logout}>Logout
                            </button>
                        }
                    </div>
                    <Form />
                </div>
                <div className="row pt-5">
                    <div className="col-12 col-lg-6 offset-lg-3">
                    { articles.map ((article) => {
                        return (
                        <div className="card my-3" key={article._id}>
                            <div className="card-header">{article.title}</div>
                            <div className="card-body">{article.body}</div>
                            <div className="card-footer"> 
                                <i>{article.author} 
                                <p className="mt-5 text-muted"><b>{article.author}</b> {moment(new Date(article.createdAt)).fromNow()}</p>
                                </i>
                            </div>
                            <div className="card-footer text-right">
                                <button 
                                    onClick={()=> this.handleEdit(article)}
                                    className="btn btn-primary mx-3">Edit</button>
                                <button 
                                    onClick={()=> this.handleDelete(article._id)} 
                                    className="btn btn-danger">Delete</button>
                            </div>
                        </div> )
                    })}
                    </div>
                </div>
        </div>
        );
    }
}

const mapStateToProps = state => ({
  articles: state.home.articles,
});

const mapDispatchToProps = dispatch => ({
  onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
  onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
  setEdit: article => dispatch({ type: 'SET_EDIT', article }),

});

export default connect(mapStateToProps, mapDispatchToProps)(Home);