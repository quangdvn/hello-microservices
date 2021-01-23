import axios from 'axios';

const buildApi = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://172-17-0-2.ingress-nginx-controller-admission.kube-system.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildApi;
