/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Moment from 'react-moment';

import PropTypes from 'prop-types'; // ES6

import { listOfApplications, createApplication } from '../../services/api';
import { validateFormField, checkValid } from '../../services/formValidator';

const styles = {
  root: {
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
  },
  progress: {
    margin: '0 auto',
    'margin-top': 140,
  },
  listContainer: {
    width: '100%',
  },
  inline: {
    display: 'inline',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
  },
  extendedIcon: {
    marginRight: 16,
  },

  card: {
    maxWidth: 720,
    margin: '0 auto',
    marginTop: 120,
  },
};

class HomePage extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      dialogNewApplicationOpen: false,
      developerApplications: [],
      newApplication: {
        name: '',
        description: '',
        apple_store_link: '',
        google_market_link: '',
      },
      errors: {
        name: false,
        description: false,
        apple_store_link: false,
        google_market_link: false,
      },
    };
  }

  componentDidMount() {
    listOfApplications().then((res) => {
      this.setState({
        loading: false,
        developerApplications: res,
      });
    });
  }

  rowClick(application) {
    const { history } = this.props;
    history.push(`/application/${application._id}`);
  }

  handleClickOpen() {
    this.setState({
      dialogNewApplicationOpen: true,
    });
  }

  handleClose() {
    this.setState({
      dialogNewApplicationOpen: false,
      newApplication: {
        name: '',
        description: '',
        apple_store_link: '',
        google_market_link: '',
      },
      errors: {
        name: false,
        description: false,
        apple_store_link: false,
        google_market_link: false,
      },
    });
  }

  handleChange(name, event) {
    const { newApplication, errors } = this.state;
    const { value } = event.target;

    const validated = validateFormField(value, name);
    this.setState({
      newApplication: {
        ...newApplication,
        [name]: value,
      },
      errors: {
        ...errors,
        [name]: !validated,
      },
    });
  }

  async clickCreateApplication() {
    const { newApplication } = this.state;
    const response = await createApplication(newApplication);
    this.handleClose();

    const { history } = this.props;
    history.push(`/application/${response._id}`);
  }

  render() {
    const { classes } = this.props;
    const {
      developerApplications,
      loading,
      dialogNewApplicationOpen,
      newApplication,
      errors,
    } = this.state;
    return (
      <>
        <List className={classes.root}>
          {loading && <CircularProgress className={classes.progress} />}

          {!loading &&
            developerApplications.map((application) => (
              <div key={application._id} className={classes.listContainer}>
                <ListItem
                  alignItems="flex-start"
                  button
                  onClick={() => this.rowClick(application)}
                >
                  <ListItemText
                    primary={
                      <>
                        {application.name}
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {' - '}
                          <Moment format="YYYY-MM-DD HH:mm">
                            {application.updated_at}
                          </Moment>
                        </Typography>
                      </>
                    }
                    secondary={application.description}
                  />
                </ListItem>
                <Divider component="li" />
              </div>
            ))}
        </List>

        {developerApplications.length === 0 && !loading && (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2">
                <DeveloperModeIcon />
                {'  '} Welcome
              </Typography>
              <Typography variant="body1" component="p">
                Add your first application with the bottom right button.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Go to documentation</Button>
            </CardActions>
          </Card>
        )}

        <Fab
          variant="extended"
          size="large"
          color="primary"
          aria-label="Add"
          className={classes.fab}
          onClick={() => this.handleClickOpen()}
        >
          <AddIcon className={classes.extendedIcon} />
          New application
        </Fab>

        <Dialog
          open={dialogNewApplicationOpen}
          onClose={() => this.handleClose()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">New Application</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Fill in the required fields to create a new application. It will
              allow you to get Token to use Connect API.
            </DialogContentText>
            <TextField
              autoFocus
              required
              id="name"
              label="Name"
              className={classes.textField}
              fullWidth
              value={newApplication.name}
              onChange={(event) => this.handleChange('name', event)}
              margin="normal"
              variant="outlined"
              error={errors.name}
            />

            <TextField
              required
              id="description"
              label="Description"
              className={classes.textField}
              fullWidth
              value={newApplication.description}
              onChange={(event) => this.handleChange('description', event)}
              margin="normal"
              variant="outlined"
              multiline
              rows="4"
              error={errors.description}
            />

            <TextField
              id="apple_store_link"
              label="App Store Link"
              className={classes.textField}
              fullWidth
              value={newApplication.apple_store_link}
              onChange={(event) => this.handleChange('apple_store_link', event)}
              margin="normal"
              variant="outlined"
              error={errors.apple_store_link}
            />

            <TextField
              id="google_market_link"
              label="Play Store Link"
              className={classes.textField}
              fullWidth
              value={newApplication.google_market_link}
              onChange={(event) =>
                this.handleChange('google_market_link', event)}
              margin="normal"
              variant="outlined"
              error={errors.google_market_link}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="primary">
              Cancel
            </Button>
            <Button
              disabled={
                !checkValid(errors) ||
                !newApplication.name ||
                !newApplication.description
              }
              onClick={() => this.clickCreateApplication()}
              color="primary"
            >
              Create application
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(withStyles(styles)(HomePage));
